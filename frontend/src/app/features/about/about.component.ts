import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white shadow rounded-lg p-6">
      <h1 class="text-2xl font-bold text-primary-600 mb-6">About the Urban Tree Observatory</h1>
      
      <div class="mb-8">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Project Overview</h2>
        <p class="text-gray-700 mb-4">
          The Urban Tree Observatory is a comprehensive platform developed by GibdetColombia Chapter 
          to monitor, analyze, and manage urban forests in Colombia, starting with Ibague. 
          Our mission is to promote sustainable urban forestry practices through 
          data-driven decision making and community engagement.
        </p>
        <p class="text-gray-700 mb-4">
          By collecting and analyzing data on tree health, biodiversity, and environmental impact, 
          we aim to improve urban forest management, enhance urban biodiversity, and mitigate 
          the effects of climate change in urban environments.
        </p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <!-- Key Features -->
        <div class="border rounded-lg shadow p-4">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Key Features</h2>
          <ul class="space-y-3">
            <li class="flex items-start">
              <svg class="h-5 w-5 text-green-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <div>
                <p class="font-medium">Interactive Tree Mapping</p>
                <p class="text-sm text-gray-600">Visualize and explore urban trees with detailed geospatial data</p>
              </div>
            </li>
            <li class="flex items-start">
              <svg class="h-5 w-5 text-green-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <div>
                <p class="font-medium">Comprehensive Tree Database</p>
                <p class="text-sm text-gray-600">Detailed records of species, health status, and maintenance history</p>
              </div>
            </li>
            <li class="flex items-start">
              <svg class="h-5 w-5 text-green-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <div>
                <p class="font-medium">Environmental Monitoring</p>
                <p class="text-sm text-gray-600">Track climate data and assess environmental impacts</p>
              </div>
            </li>
            <li class="flex items-start">
              <svg class="h-5 w-5 text-green-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <div>
                <p class="font-medium">Analytics and Reports</p>
                <p class="text-sm text-gray-600">Generate insights through data visualization and analysis</p>
              </div>
            </li>
            <li class="flex items-start">
              <svg class="h-5 w-5 text-green-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <div>
                <p class="font-medium">Alert System</p>
                <p class="text-sm text-gray-600">Get notified about critical tree health issues and maintenance needs</p>
              </div>
            </li>
          </ul>
        </div>
        
        <!-- Use Cases -->
        <div class="border rounded-lg shadow p-4">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Use Cases</h2>
          <div class="space-y-4">
            <div class="bg-gray-50 p-3 rounded-md border border-gray-200">
              <h3 class="font-medium text-primary-700">Urban Planning</h3>
              <p class="text-sm text-gray-600 mt-1">
                City planners use our platform to assess tree coverage, identify areas requiring more green 
                spaces, and plan sustainable urban development.
              </p>
            </div>
            
            <div class="bg-gray-50 p-3 rounded-md border border-gray-200">
              <h3 class="font-medium text-primary-700">Environmental Research</h3>
              <p class="text-sm text-gray-600 mt-1">
                Researchers analyze tree data and climate information to study urban heat islands, 
                air quality, and biodiversity patterns.
              </p>
            </div>
            
            <div class="bg-gray-50 p-3 rounded-md border border-gray-200">
              <h3 class="font-medium text-primary-700">Maintenance Management</h3>
              <p class="text-sm text-gray-600 mt-1">
                Municipal tree care teams use alerts and health indicators to prioritize maintenance 
                activities and prevent tree damage.
              </p>
            </div>
            
            <div class="bg-gray-50 p-3 rounded-md border border-gray-200">
              <h3 class="font-medium text-primary-700">Public Education</h3>
              <p class="text-sm text-gray-600 mt-1">
                Schools and community organizations access tree data to educate about urban ecology, 
                biodiversity, and environmental stewardship.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="mb-8">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Our Impact</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="bg-green-50 p-4 rounded-lg text-center">
            <div class="text-3xl font-bold text-green-700 mb-1">96,943</div>
            <div class="text-sm text-green-600">Trees Monitored</div>
          </div>
          
          <div class="bg-blue-50 p-4 rounded-lg text-center">
            <div class="text-3xl font-bold text-blue-700 mb-1">439</div>
            <div class="text-sm text-blue-600">Species Documented</div>
          </div>
          
          <div class="bg-purple-50 p-4 rounded-lg text-center">
            <div class="text-3xl font-bold text-purple-700 mb-1">17.30 m</div>
            <div class="text-sm text-purple-600">Average Tree Height</div>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-amber-50 p-4 rounded-lg text-center">
            <div class="text-3xl font-bold text-amber-700 mb-1">0.18</div>
            <div class="text-sm text-amber-600">Tree-per-capita Index</div>
          </div>
          
          <div class="bg-teal-50 p-4 rounded-lg text-center">
            <div class="text-3xl font-bold text-teal-700 mb-1">5</div>
            <div class="text-sm text-teal-600">Research Partnerships</div>
          </div>
        </div>
      </div>
      
      <div class="mb-8">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Environmental Benefits</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-green-50 p-4 rounded-lg border border-green-100">
            <h3 class="font-medium text-green-800 mb-2">CO₂ Absorption</h3>
            <div class="text-2xl font-bold text-green-700">646,867.27 Tons</div>
            <p class="text-sm text-green-600 mt-2">
              Our urban forest captures carbon dioxide, mitigating greenhouse gas effects and combating climate change.
            </p>
          </div>
          
          <div class="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 class="font-medium text-blue-800 mb-2">Oxygen Production</h3>
            <div class="text-2xl font-bold text-blue-700">1,727,135.62 Tons/year</div>
            <p class="text-sm text-blue-600 mt-2">
              Ibagué's trees generate life-sustaining oxygen, enhancing air quality for the community.
            </p>
          </div>
        </div>
      </div>

      <!-- Sponsors -->
      <div class="border rounded-lg shadow p-4">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Sponsors</h2>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-gray-50 p-3 rounded-md border border-gray-200">
            <div class="flex justify-center items-center">
              <svg  xmlns="http://www.w3.org/2000/svg" width="200" height="200" fill="currentColor">
                <rect width="100%" height="100%" fill="#e0e0e0" stroke="#a0a0a0" stroke-dasharray="5,5"/>
                  <text x="100" y="100"
                      font-family="sans-serif"
                      font-size="20"
                      fill="#555"
                      text-anchor="middle"
                      dominant-baseline="middle">
                    Logo Sponsor 1
                </text>
              </svg>
            </div>
            <h3 class="font-medium text-primary-700 text-center">Sponsor 1</h3>
          </div>

          <div class="bg-gray-50 p-3 rounded-md border border-gray-200">
            <div class="flex justify-center items-center">
              <svg  xmlns="http://www.w3.org/2000/svg" width="200" height="200" fill="currentColor">
                <rect width="100%" height="100%" fill="#e0e0e0" stroke="#a0a0a0" stroke-dasharray="5,5"/>
                  <text x="100" y="100"
                      font-family="sans-serif"
                      font-size="20"
                      fill="#555"
                      text-anchor="middle"
                      dominant-baseline="middle">
                    Logo Sponsor 2
                </text>
              </svg>
            </div>
            <h3 class="font-medium text-primary-700 text-center">Sponsor 2</h3>
          </div>

          <div class="bg-gray-50 p-3 rounded-md border border-gray-200">
            <div class="flex justify-center items-center">
              <svg  xmlns="http://www.w3.org/2000/svg" width="200" height="200" fill="currentColor">
                <rect width="100%" height="100%" fill="#e0e0e0" stroke="#a0a0a0" stroke-dasharray="5,5"/>
                  <text x="100" y="100"
                      font-family="sans-serif"
                      font-size="20"
                      fill="#555"
                      text-anchor="middle"
                      dominant-baseline="middle">
                    Logo Sponsor 3
                </text>
              </svg>
            </div>
            <h3 class="font-medium text-primary-700 text-center">Sponsor 3</h3>
          </div>

          <div class="bg-gray-50 p-3 rounded-md border border-gray-200">
            <div class="flex justify-center items-center">
              <svg  xmlns="http://www.w3.org/2000/svg" width="200" height="200" fill="currentColor">
                <rect width="100%" height="100%" fill="#e0e0e0" stroke="#a0a0a0" stroke-dasharray="5,5"/>
                  <text x="100" y="100"
                      font-family="sans-serif"
                      font-size="20"
                      fill="#555"
                      text-anchor="middle"
                      dominant-baseline="middle">
                    Logo Sponsor 4
                </text>
              </svg>
            </div>
            <h3 class="font-medium text-primary-700 text-center">Sponsor 4</h3>
          </div>
        </div>
      </div>


      <div class="border-t pt-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Get Involved</h2>
        <p class="text-gray-700 mb-4">
          We welcome collaboration from researchers, municipal partners, and community organizations. 
          If you're interested in contributing to the Urban Tree Observatory or using our data for 
          research purposes, please contact us at <a href="mailto:contact&#64;gibdetcolombia.org" class="text-primary-600 hover:underline">contact&#64;gibdetcolombia.org</a>.
        </p>
      </div>
    </div>
  `,
  styles: [`
    /* About component specific styles can be added here */
  `]
})
export class AboutComponent {
  // Any component logic would go here
}