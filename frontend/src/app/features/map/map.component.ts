import { Component, AfterViewInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-map',
  standalone: true,
  template: `
    <div class="flex flex-row h-full gap-4">
      <!-- Details Panel -->
      <div class="bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-[16rem]">
        <div class="grid grid-cols-1 gap-6">
          <!-- Left Column -->
          <div>
            <h2 class="text-2xl font-bold text-gray-800 mb-4">{{ selectedRegion?.name || 'Ibagué Overview' }}</h2>

            <!-- Tree Statistics -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-700">Tree Statistics</h3>
              <div class="grid grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <p class="text-2xl font-bold text-green-700">{{ selectedRegion?.statistics?.totalTrees || '96,943' }}</p>
                  <p class="text-sm text-gray-600">Total Trees</p>
                </div>
                <div>
                  <p class="text-2xl font-bold text-green-700">{{ selectedRegion?.statistics?.speciesCount || '439' }}</p>
                  <p class="text-sm text-gray-600">Species Count</p>
                </div>
                <div>
                  <p class="text-2xl font-bold text-green-700">{{ selectedRegion?.statistics?.avgHeight || '17.30' }} m</p>
                  <p class="text-sm text-gray-600">Average Height</p>
                </div>
                <div>
                  <p class="text-2xl font-bold text-green-700">{{ selectedRegion?.statistics?.healthIndex || '0.18' }}</p>
                  <p class="text-sm text-gray-600">Tree-per-capita index</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column -->
          <div>
            <h3 class="text-lg font-semibold text-gray-700 mb-4">Environmental Impact</h3>
            <div class="space-y-4">
              <div>
                <p class="text-2xl font-bold text-green-700">{{ selectedRegion?.environmental?.co2Absorption || '646,867.27' }} Ton</p>
                <p class="text-sm text-gray-600">CO₂ Absorption</p>
              </div>
              <div>
                <p class="text-2xl font-bold text-green-700">{{ selectedRegion?.environmental?.oxygenProduction || '1,727,135.62' }} Ton/year</p>
                <p class="text-sm text-gray-600">Oxygen Production</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Map container -->
      <div
        id="map"
        class="flex-1 rounded-lg shadow-lg border border-gray-200 min-h-[500px]"
      ></div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
    #map {
      width: 100%;
      height: 100%;
    }
    ::ng-deep .region-label {
      background: transparent;
      border: none;
      box-shadow: none;
    }
    ::ng-deep .label-content {
      color: white;
      text-align: center;
      text-shadow: 0 0 3px rgba(0,0,0,0.75);
      font-weight: bold;
    }
    ::ng-deep .region-name {
      font-size: 16px;
      margin-bottom: 4px;
    }
    ::ng-deep .statistics {
      font-size: 14px;
    }
  `],
  imports: [HttpClientModule, CommonModule]
})

export class MapComponent implements AfterViewInit, OnChanges {
  @Input() isSidebarOpen: boolean = true;
  private map!: L.Map;
  private shownLabels = new Set<string>();
  
  selectedRegion: any = {
    name: 'Ibagué Overview',
    statistics: {
      totalTrees: 0,
      speciesCount: 0,
      avgHeight: 0,
      healthIndex: 0
    },
    environmental: {
      co2Absorption: 0,
      oxygenProduction: 0
    }
  };

  constructor(private http: HttpClient) {}

  ngAfterViewInit() {
    this.initMap();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.map && changes['isSidebarOpen']) {
      setTimeout(() => {
        this.map.invalidateSize();
      }, 300);
    }
  }

  private initMap(): void {
    this.map = L.map('map').setView([4.4389, -75.2322], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 20,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Lista de IDs del 1 al 13
    const comunaIds = Array.from({ length: 13 }, (_, i) => i + 1);
    
    // Hacer solicitudes en paralelo
    forkJoin(
      comunaIds.map(id => 
        this.http.get<any>(`http://localhost:8000/api/v1/places/localities/${id}/`)
      )
    ).subscribe({
      next: (responses) => {
        const allLayers = L.featureGroup();

        responses.forEach(data => {
          // Validar datos antes de procesar
          if (!data?.boundary?.coordinates) return;

          const geojsonFeature = {
            type: 'Feature' as const,
            geometry: data.boundary,
            properties: {
              name: data.name || `Comuna ${data.id}`,
              statistics: data.statistics || {},
              environmental: data.environmental || {}
            }
          };

          const geoLayer = L.geoJSON(geojsonFeature, {
            style: {
              color: '#ffffff',
              weight: 1,
              fillColor: '#2F7B3D',
              fillOpacity: 0.5
            },
            onEachFeature: (feature, layer) => {
              if (feature.properties) {
                const comuna = feature.properties.name || 'Unknown Region';

                if (!this.shownLabels.has(comuna)) {
                  try {
                    const bounds = (layer as L.Polygon).getBounds();
                    if (bounds.isValid()) {
                      const center = bounds.getCenter();

                      const label = L.divIcon({
                        className: 'region-label',
                        html: `<div class="label-content">
                                <div class="region-name">${comuna}</div>
                                ${feature.properties.statistics ?
                                  `<div class="statistics">${feature.properties.statistics.totalTrees || 'N/A'}</div>`
                                  : ''}
                              </div>`,
                        iconSize: [200, 50],
                        iconAnchor: [100, 25]
                      });

                      L.marker(center, {
                        icon: label,
                        interactive: false
                      }).addTo(this.map);

                      this.shownLabels.add(comuna);
                    }
                  } catch (error) {
                    console.warn(`Error creando etiqueta para ${comuna}:`, error);
                  }
                }

                layer.on({
                  mouseover: (e) => {
                    const layer = e.target;
                    layer.setStyle({ fillOpacity: 0.7 });
                  },
                  mouseout: (e) => {
                    const layer = e.target;
                    layer.setStyle({ fillOpacity: 0.5 });
                  },
                  click: (e) => {
                    const layer = e.target;
                    const bounds = layer.getBounds();

                    this.map.fitBounds(bounds, {
                      padding: [10, 10],
                      maxZoom: 16
                    });

                    this.selectedRegion = {
                      name: feature.properties.name || comuna,
                      statistics: feature.properties.statistics || {
                        totalTrees: 'N/A',
                        speciesCount: 'N/A',
                        avgHeight: 'N/A',
                        healthIndex: 'N/A'
                      },
                      environmental: feature.properties.environmental || {
                        co2Absorption: 'N/A',
                        oxygenProduction: 'N/A'
                      }
                    };
                  }
                });
              }
            }
          });

          geoLayer.addTo(allLayers);
        });

        if (allLayers.getLayers().length > 0) {
          allLayers.addTo(this.map);
          this.map.fitBounds(allLayers.getBounds(), { padding: [40, 40] });
          setTimeout(() => this.map.invalidateSize(), 100);
        }
      },
      error: (error) => {
        console.error('Error cargando comunas:', error);
      }
    });
  }
}

