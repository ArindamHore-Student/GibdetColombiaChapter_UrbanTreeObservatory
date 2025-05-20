import { Component, AfterViewInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { forkJoin } from 'rxjs';

interface GeoJsonProperties {
  name: string;
  statistics?: any;
  environmental?: any;
}

@Component({
  selector: 'app-map',
  standalone: true,
  template: `
    <div class="flex flex-row h-full gap-4">
      <div class="bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-[16rem]">
        <div class="grid grid-cols-1 gap-6">
          <div>
            <h2 class="text-2xl font-bold text-gray-800 mb-4">{{ selectedRegion?.name || 'Ibagué Overview' }}</h2>
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

          <div *ngIf="selectedTree" class="mt-6 border-t pt-4">
            <h3 class="text-lg font-semibold text-gray-700 mb-4">Selected Tree</h3>
            <div class="space-y-2">
              <p><span class="font-semibold text-gray-700">Common Name:</span> {{ selectedTree.commonName }}</p>
              <p><span class="font-semibold text-gray-700">Scientific Name:</span> <em>{{ selectedTree.scientificName }}</em></p>
              <p><span class="font-semibold text-gray-700">Life Form:</span> {{ selectedTree.lifeForm }}</p>
              <p><span class="font-semibold text-gray-700">Neighborhood:</span> {{ selectedTree.neighborhood }}</p>
            </div>
          </div>

        </div>
      </div>
      <div id="map" class="flex-1 rounded-lg shadow-lg border border-gray-200 min-h-[500px]"></div>
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
  private pointLayer: L.LayerGroup = L.layerGroup();
  private localityLayer: L.FeatureGroup = L.featureGroup();
  private neighborhoodLayer: L.FeatureGroup = L.featureGroup();
  private localityLabels: L.LayerGroup = L.layerGroup();  

  selectedRegion: any = {
    name: 'Ibagué Overview',
    statistics: { totalTrees: 0, speciesCount: 0, avgHeight: 0, healthIndex: 0 },
    environmental: { co2Absorption: 0, oxygenProduction: 0 }
  };

  selectedTree: {
  commonName: string;
  scientificName: string;
  lifeForm: string;
  neighborhood: string;
} | null = null;

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
      maxZoom: 23,
      attribution: '© OpenStreetMap contributors',
      errorTileUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg',
      keepBuffer: 10
    }).addTo(this.map);

    this.loadLocalities();
    this.loadNeighborhoods();
    this.map.removeLayer(this.neighborhoodLayer);

    this.map.on('zoomend', () => {
      this.toggleLayersByZoom();
      this.loadPointsByZoom();
    });

    this.map.on('moveend', () => {
      this.loadPointsByZoom();
    });
  }

  private loadLocalities(): void {
    const comunaIds = Array.from({ length: 13 }, (_, i) => i + 1);

    forkJoin(
      comunaIds.map(id => this.http.get<any>(`http://localhost:8000/api/v1/places/localities/${id}/`))
    ).subscribe({
      next: (responses) => {
        this.shownLabels.clear();           
        this.localityLabels.clearLayers();  

        responses.forEach(data => {
          if (!data?.boundary?.coordinates) return;

          const geojsonFeature: GeoJSON.Feature = {
            type: 'Feature',
            geometry: data.boundary,
            properties: {
              name: data.name || `Comuna ${data.id}`,
              statistics: data.statistics || {},
              environmental: data.environmental || {}
            }
          };

          const geoLayer = L.geoJSON(geojsonFeature as GeoJSON.GeoJsonObject, {
            style: {
              color: '#ffffff',
              weight: 1,
              fillColor: '#2F7B3D',
              fillOpacity: 0.5
            },
            onEachFeature: (feature, layer) => {
              const comuna = feature.properties?.name || 'Unknown Region';

              if (!this.shownLabels.has(comuna)) {
                try {
                  const bounds = (layer as L.Polygon).getBounds();
                  if (bounds.isValid()) {
                    const center = bounds.getCenter();
                    const label = L.divIcon({
                      className: 'region-label',
                      html: `<div class="label-content">
                              <div class="region-name">${comuna}</div>
                              ${feature.properties?.statistics ? 
                                `<div class="statistics">${feature.properties.statistics.totalTrees || 'N/A'}</div>` : ''}
                            </div>`,
                      iconSize: [200, 50],
                      iconAnchor: [100, 25]
                    });

                    const marker = L.marker(center, {
                      icon: label,
                      interactive: false
                    });

                    this.localityLabels.addLayer(marker);  // ⬅️ Agrega al grupo

                    this.shownLabels.add(comuna);
                  }
                } catch (error) {
                  console.warn(`Error creating label for ${comuna}:`, error);
                }
              }

              layer.on({
                mouseover: (e) => {
                  const l = e.target;
                  l.setStyle({ fillOpacity: 0.7 });
                },
                mouseout: (e) => {
                  const l = e.target;
                  l.setStyle({ fillOpacity: 0.5 });
                },
                click: (e) => {
                  const l = e.target;
                  const bounds = l.getBounds();
                  this.map.fitBounds(bounds, {
                    padding: [10, 10],
                    maxZoom: 16
                  });

                  this.selectedRegion = {
                    name: comuna,
                    statistics: feature.properties?.statistics || {
                      totalTrees: 'N/A',
                      speciesCount: 'N/A',
                      avgHeight: 'N/A',
                      healthIndex: 'N/A'
                    },
                    environmental: feature.properties?.environmental || {
                      co2Absorption: 'N/A',
                      oxygenProduction: 'N/A'
                    }
                  };
                }
              });
            }
          });

          geoLayer.addTo(this.localityLayer);
        });

        this.localityLayer.addTo(this.map);
        this.localityLabels.addTo(this.map);  // ⬅️ Añade las etiquetas al mapa
      },
      error: (error) => {
        console.error('Error loading communes:', error);
      }
    });
  }

  private loadNeighborhoods(): void {
    const barrioIds = Array.from({ length: 687 }, (_, i) => i + 1);

    forkJoin(
      barrioIds.map(id => this.http.get<any>(`http://localhost:8000/api/v1/places/neighborhoods/${id}/`))
    ).subscribe({
      next: (responses) => {
        responses.forEach(data => {
          if (!data?.boundary?.coordinates) return;
          const geojsonFeature: GeoJSON.Feature = {
            type: 'Feature',
            geometry: data.boundary,
            properties: { name: data.name || `Barrio ${data.id}` }
          };
          const geoLayer = L.geoJSON(geojsonFeature as GeoJSON.GeoJsonObject, {
            style: {
              color: '#3333ff',
              weight: 1,
              fillColor: '#32CD32',
              fillOpacity: 0.3
            }
          });
          geoLayer.addTo(this.neighborhoodLayer);
        });
      },
      error: (error) => {
        console.error('Error loading neighborhoods:', error);
      }
    });
  }

  private toggleLayersByZoom(): void {
    const zoom = this.map.getZoom();

    if (zoom >= 19) {
      this.map.removeLayer(this.localityLayer);
      this.map.removeLayer(this.localityLabels);  // ⬅️ Oculta etiquetas también
      this.map.removeLayer(this.neighborhoodLayer);
    } else if (zoom >= 17) {
      this.map.addLayer(this.neighborhoodLayer);
      this.map.removeLayer(this.localityLayer);
      this.map.removeLayer(this.localityLabels);
    } else {
      this.map.addLayer(this.localityLayer);
      this.map.addLayer(this.localityLabels);     // ⬅️ Muestra etiquetas con capas
      this.map.removeLayer(this.neighborhoodLayer);
    }
  }

  private loadPointsByZoom(): void {
    const zoom = this.map.getZoom();
    if (zoom < 19) {
      this.removePoints();
      return;
    }

    const bounds = this.map.getBounds();
    const minLat = bounds.getSouth();
    const maxLat = bounds.getNorth();
    const minLon = bounds.getWest();
    const maxLon = bounds.getEast();

    const url = `http://localhost:8000/api/v1/biodiversity/records/bbox/?min_lon=${minLon}&min_lat=${minLat}&max_lon=${maxLon}&max_lat=${maxLat}`;

    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        this.pointLayer.clearLayers();

        data.forEach(record => {
          if (record.latitude && record.longitude) {
            const marker = L.circleMarker([record.latitude, record.longitude], {
              radius: 5,
              color: '#000000',
              weight: 1,
              fillColor: '#006400',
              fillOpacity: 0.6
            });

            marker.on('click', () => {
              this.selectedTree = {
                commonName: record.common_name || 'N/A',
                scientificName: record.species?.scientific_name || 'N/A',
                lifeForm: record.species?.life_form || 'N/A',
                neighborhood: record.neighborhood?.name || 'N/A'
              };
            });

            marker.addTo(this.pointLayer);
          }
        });

        this.pointLayer.addTo(this.map);
      },
      error: (error) => {
        console.error('Error loading points:', error);
      }
    });
  }

  private removePoints(): void {
    this.map.removeLayer(this.pointLayer);
  }
}

