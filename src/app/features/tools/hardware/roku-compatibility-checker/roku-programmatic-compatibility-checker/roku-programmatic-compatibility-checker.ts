import { Component, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';

interface RokuModel {
  model: string;
  productType: string;
  category: string;
  voiceRemoteCompatible: string;
  voiceRemoteProCompatible: string;
  appleAirPlay: string;
  appleHomeKit: string;
  minRokuOSAirPlayHomeKit: string;
  fourKSupport: string;
  hdrSupport: string;
  dolbyVisionSupport: string;
  bluetoothAudioStreaming: string;
  bluetoothHeadphoneMode: string;
  ethernetAdapterSupport: string;
  appleTvChannel: string;
  gamingConsoleCompatible: string;
  googleAssistant: string;
  amazonAlexa: string;
  netflixGamesOnTv: string;
  ambientLightSensor: string;
  fastTvStart: string;
  hdmiCecSupport: string;
  compatibleEthernetAdapters: string;
  wirelessSpeakersCompatible: string;
  wirelessBassCompatible: string;
  remoteFinderFeature: string;
  rechargeableRemote: string;
  handsFreeVoice: string;
  mobileAppCompatible: string;
  lostRemoteFinderButton: string;
  builtInEthernet: string;
  wifiRequired: string;
  powerRequirements: string;
  batteryPowered: string;
  chargeTime: string;
  batteryLife: string;
  wifiType: string;
  smartHomeAppRequired: string;
  proMonitoringAvailable: string;
  worksWithRokuTvOnly: string;
  maxRange: string;
  weatherproofRating: string;
  videoResolution: string;
  nightVision: string;
  twoWayAudio: string;
  motionDetection: string;
  soundDetection: string;
  cloudRecording: string;
  smartDetection: string;
  sirenFeature: string;
  microSdSupport: string;
}

interface CompatibilityCategory {
  name: string;
  icon: string;
  items: CompatibilityItem[];
}

interface CompatibilityItem {
  label: string;
  value: string;
  isCompatible: boolean;
  icon: string;
}

interface CategoryFilter {
  id: string;
  label: string;
  selected: boolean;
  matcher: (model: RokuModel) => boolean;
}

@Component({
  selector: 'app-roku-programmatic-compatibility-checker',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule,
    MatChipsModule,
    MatCheckboxModule
  ],
  templateUrl: './roku-programmatic-compatibility-checker.html',
  styleUrl: './roku-programmatic-compatibility-checker.scss',
})
export class RokuProgrammaticCompatibilityChecker implements OnInit {
  selectedModel = signal<string>('');
  searchTerm = signal<string>('');

  rokuModels: RokuModel[] = [];

  // Category filters
  categories = signal<CategoryFilter[]>([
    {
      id: 'all',
      label: 'All',
      selected: true,
      matcher: () => true
    },
    {
      id: 'roku',
      label: 'Roku',
      selected: false,
      matcher: (model) => model.category.toLowerCase().includes('streaming') && !model.productType.toLowerCase().includes('stick')
    },
    {
      id: 'roku-stick',
      label: 'Roku Stick',
      selected: false,
      matcher: (model) => model.productType.toLowerCase().includes('stick')
    },
    {
      id: 'streambars',
      label: 'Streambars',
      selected: false,
      matcher: (model) => model.category.toLowerCase().includes('soundbar')
    },
    {
      id: 'speakers',
      label: 'Speakers',
      selected: false,
      matcher: (model) => model.category.toLowerCase().includes('audio accessory')
    },
    {
      id: 'tvs',
      label: 'TVs',
      selected: false,
      matcher: (model) => model.category.toLowerCase().includes('television') || model.category.toLowerCase().includes('roku tv')
    },
    {
      id: 'cameras',
      label: 'Cameras',
      selected: false,
      matcher: (model) => model.category.toLowerCase().includes('camera')
    },
    {
      id: 'doorbells',
      label: 'Doorbells',
      selected: false,
      matcher: (model) => model.category.toLowerCase().includes('doorbell')
    },
    {
      id: 'smart-plugs',
      label: 'Smart Plugs',
      selected: false,
      matcher: (model) => model.category.toLowerCase().includes('plug')
    },
    {
      id: 'light-strips',
      label: 'Light Strips',
      selected: false,
      matcher: (model) => model.category.toLowerCase().includes('lighting')
    }
  ]);

  // Filtered models based on search and category
  filteredModels = computed(() => {
    const search = this.searchTerm().toLowerCase();
    const selectedCategories = this.categories().filter(c => c.selected);

    // If "All" is selected or no categories are selected, don't filter by category
    const allSelected = selectedCategories.some(c => c.id === 'all') || selectedCategories.length === 0;

    let filtered = this.rokuModels;

    // Apply category filter
    if (!allSelected) {
      filtered = filtered.filter(model =>
        selectedCategories.some(cat => cat.matcher(model))
      );
    }

    // Apply search filter
    if (search) {
      filtered = filtered.filter(model =>
        model.model.toLowerCase().includes(search) ||
        model.productType.toLowerCase().includes(search)
      );
    }

    return filtered;
  });

  // Get selected model data
  selectedModelData = computed(() => {
    const model = this.selectedModel();
    return this.rokuModels.find(m => m.model === model);
  });

  // Get compatibility categories
  compatibilityCategories = computed(() => {
    const model = this.selectedModelData();
    if (!model) return [];

    const categories: CompatibilityCategory[] = [];
    const category = model.category.toLowerCase();

    // Helper function to check if a value is "compatible" (Yes, or specific non-empty values)
    const isCompatible = (value: string): boolean => {
      return value === 'Yes' || (value !== 'No' && value !== 'Unknown' && value.trim() !== '');
    };

    // Categories for Streaming Players, TVs, and Soundbars
    if (category.includes('streaming') || category.includes('television') || category.includes('soundbar') || category.includes('roku tv')) {
      categories.push({
        name: 'Video & Display',
        icon: 'tv',
        items: [
          { label: '4K Support', value: model.fourKSupport, isCompatible: model.fourKSupport === 'Yes', icon: '4k' },
          { label: 'HDR Support', value: model.hdrSupport, isCompatible: model.hdrSupport === 'Yes', icon: 'hdr_on' },
          { label: 'Dolby Vision', value: model.dolbyVisionSupport, isCompatible: model.dolbyVisionSupport === 'Yes', icon: 'movie' },
          { label: 'HDMI-CEC', value: model.hdmiCecSupport, isCompatible: model.hdmiCecSupport === 'Yes', icon: 'cable' },
          { label: 'Fast TV Start', value: model.fastTvStart, isCompatible: model.fastTvStart === 'Yes', icon: 'speed' },
          { label: 'Ambient Light Sensor', value: model.ambientLightSensor, isCompatible: model.ambientLightSensor === 'Yes', icon: 'wb_sunny' }
        ]
      });

      categories.push({
        name: 'Remote Features',
        icon: 'settings_remote',
        items: [
          { label: 'Voice Remote', value: model.voiceRemoteCompatible, isCompatible: model.voiceRemoteCompatible === 'Yes', icon: 'mic' },
          { label: 'Voice Remote Pro', value: model.voiceRemoteProCompatible, isCompatible: model.voiceRemoteProCompatible === 'Yes', icon: 'mic' },
          { label: 'Hands-Free Voice', value: model.handsFreeVoice, isCompatible: model.handsFreeVoice === 'Yes', icon: 'record_voice_over' },
          { label: 'Remote Finder', value: model.remoteFinderFeature, isCompatible: model.remoteFinderFeature === 'Yes', icon: 'search' },
          { label: 'Rechargeable Remote', value: model.rechargeableRemote, isCompatible: model.rechargeableRemote === 'Yes', icon: 'battery_charging_full' },
          { label: 'Lost Remote Finder Button', value: model.lostRemoteFinderButton, isCompatible: isCompatible(model.lostRemoteFinderButton), icon: 'find_in_page' }
        ]
      });

      categories.push({
        name: 'Smart Home & Streaming',
        icon: 'home',
        items: [
          { label: 'Apple AirPlay', value: model.appleAirPlay, isCompatible: model.appleAirPlay === 'Yes', icon: 'cast' },
          { label: 'Apple HomeKit', value: model.appleHomeKit, isCompatible: model.appleHomeKit === 'Yes', icon: 'home_automation' },
          { label: 'Google Assistant', value: model.googleAssistant, isCompatible: model.googleAssistant === 'Yes', icon: 'assistant' },
          { label: 'Amazon Alexa', value: model.amazonAlexa, isCompatible: model.amazonAlexa === 'Yes', icon: 'speaker' },
          { label: 'Apple TV Channel', value: model.appleTvChannel, isCompatible: model.appleTvChannel === 'Yes', icon: 'apple' },
          { label: 'Netflix Games', value: model.netflixGamesOnTv, isCompatible: model.netflixGamesOnTv === 'Yes', icon: 'sports_esports' }
        ]
      });

      categories.push({
        name: 'Audio',
        icon: 'volume_up',
        items: [
          { label: 'Bluetooth Audio Streaming', value: model.bluetoothAudioStreaming, isCompatible: model.bluetoothAudioStreaming === 'Yes', icon: 'bluetooth_audio' },
          { label: 'Bluetooth Headphone Mode', value: model.bluetoothHeadphoneMode, isCompatible: model.bluetoothHeadphoneMode === 'Yes', icon: 'headphones' },
          { label: 'Wireless Speakers', value: model.wirelessSpeakersCompatible, isCompatible: isCompatible(model.wirelessSpeakersCompatible), icon: 'speaker_group' },
          { label: 'Wireless Bass', value: model.wirelessBassCompatible, isCompatible: isCompatible(model.wirelessBassCompatible), icon: 'graphic_eq' }
        ]
      });

      categories.push({
        name: 'Connectivity',
        icon: 'settings_ethernet',
        items: [
          { label: 'Built-in Ethernet', value: model.builtInEthernet, isCompatible: model.builtInEthernet === 'Yes', icon: 'lan' },
          { label: 'Ethernet Adapter Support', value: model.ethernetAdapterSupport, isCompatible: model.ethernetAdapterSupport === 'Yes', icon: 'settings_ethernet' },
          { label: 'Compatible Ethernet Adapters', value: model.compatibleEthernetAdapters, isCompatible: isCompatible(model.compatibleEthernetAdapters), icon: 'cable' },
          { label: 'Mobile App', value: model.mobileAppCompatible, isCompatible: model.mobileAppCompatible === 'Yes', icon: 'smartphone' }
        ]
      });

      categories.push({
        name: 'Gaming',
        icon: 'sports_esports',
        items: [
          { label: 'Gaming Console Compatible', value: model.gamingConsoleCompatible, isCompatible: model.gamingConsoleCompatible === 'Yes', icon: 'videogame_asset' }
        ]
      });
    }

    // Categories for Smart Home Cameras
    if (category.includes('camera')) {
      categories.push({
        name: 'Video Features',
        icon: 'videocam',
        items: [
          { label: 'Video Resolution', value: model.videoResolution, isCompatible: isCompatible(model.videoResolution), icon: '4k' },
          { label: 'Night Vision', value: model.nightVision, isCompatible: isCompatible(model.nightVision), icon: 'nightlight' },
          { label: 'Two-Way Audio', value: model.twoWayAudio, isCompatible: model.twoWayAudio === 'Yes', icon: 'mic' }
        ]
      });

      categories.push({
        name: 'Detection & Alerts',
        icon: 'sensors',
        items: [
          { label: 'Motion Detection', value: model.motionDetection, isCompatible: model.motionDetection === 'Yes', icon: 'motion_sensor_active' },
          { label: 'Sound Detection', value: model.soundDetection, isCompatible: model.soundDetection === 'Yes', icon: 'graphic_eq' },
          { label: 'Smart Detection', value: model.smartDetection, isCompatible: isCompatible(model.smartDetection), icon: 'psychology' },
          { label: 'Siren Feature', value: model.sirenFeature, isCompatible: isCompatible(model.sirenFeature), icon: 'volume_up' }
        ]
      });

      categories.push({
        name: 'Storage & Recording',
        icon: 'storage',
        items: [
          { label: 'Cloud Recording', value: model.cloudRecording, isCompatible: model.cloudRecording === 'Yes', icon: 'cloud' },
          { label: 'MicroSD Support', value: model.microSdSupport, isCompatible: isCompatible(model.microSdSupport), icon: 'sd_card' }
        ]
      });

      categories.push({
        name: 'Power & Battery',
        icon: 'battery_charging_full',
        items: [
          { label: 'Battery Powered', value: model.batteryPowered, isCompatible: model.batteryPowered === 'Yes', icon: 'battery_std' },
          { label: 'Charge Time', value: model.chargeTime, isCompatible: isCompatible(model.chargeTime), icon: 'schedule' },
          { label: 'Battery Life', value: model.batteryLife, isCompatible: isCompatible(model.batteryLife), icon: 'battery_full' },
          { label: 'Power Requirements', value: model.powerRequirements, isCompatible: isCompatible(model.powerRequirements), icon: 'power' }
        ]
      });

      categories.push({
        name: 'Connectivity & Environment',
        icon: 'settings_input_antenna',
        items: [
          { label: 'WiFi Type', value: model.wifiType, isCompatible: isCompatible(model.wifiType), icon: 'wifi' },
          { label: 'WiFi Required', value: model.wifiRequired, isCompatible: model.wifiRequired === 'Yes', icon: 'network_wifi' },
          { label: 'Weatherproof Rating', value: model.weatherproofRating, isCompatible: isCompatible(model.weatherproofRating), icon: 'water_drop' },
          { label: 'Smart Home App Required', value: model.smartHomeAppRequired, isCompatible: model.smartHomeAppRequired === 'Yes', icon: 'smartphone' }
        ]
      });
    }

    // Categories for Smart Home Doorbells
    if (category.includes('doorbell')) {
      categories.push({
        name: 'Video & Audio',
        icon: 'videocam',
        items: [
          { label: 'Video Resolution', value: model.videoResolution, isCompatible: isCompatible(model.videoResolution), icon: '4k' },
          { label: 'Night Vision', value: model.nightVision, isCompatible: isCompatible(model.nightVision), icon: 'nightlight' },
          { label: 'Two-Way Audio', value: model.twoWayAudio, isCompatible: model.twoWayAudio === 'Yes', icon: 'mic' }
        ]
      });

      categories.push({
        name: 'Detection Features',
        icon: 'sensors',
        items: [
          { label: 'Motion Detection', value: model.motionDetection, isCompatible: model.motionDetection === 'Yes', icon: 'motion_sensor_active' },
          { label: 'Sound Detection', value: model.soundDetection, isCompatible: model.soundDetection === 'Yes', icon: 'graphic_eq' },
          { label: 'Smart Detection', value: model.smartDetection, isCompatible: isCompatible(model.smartDetection), icon: 'psychology' }
        ]
      });

      categories.push({
        name: 'Power & Battery',
        icon: 'battery_charging_full',
        items: [
          { label: 'Battery Powered', value: model.batteryPowered, isCompatible: model.batteryPowered === 'Yes', icon: 'battery_std' },
          { label: 'Charge Time', value: model.chargeTime, isCompatible: isCompatible(model.chargeTime), icon: 'schedule' },
          { label: 'Battery Life', value: model.batteryLife, isCompatible: isCompatible(model.batteryLife), icon: 'battery_full' },
          { label: 'Power Requirements', value: model.powerRequirements, isCompatible: isCompatible(model.powerRequirements), icon: 'power' }
        ]
      });

      categories.push({
        name: 'Connectivity',
        icon: 'wifi',
        items: [
          { label: 'WiFi Type', value: model.wifiType, isCompatible: isCompatible(model.wifiType), icon: 'network_wifi' },
          { label: 'WiFi Required', value: model.wifiRequired, isCompatible: model.wifiRequired === 'Yes', icon: 'settings_input_antenna' },
          { label: 'Smart Home App Required', value: model.smartHomeAppRequired, isCompatible: model.smartHomeAppRequired === 'Yes', icon: 'smartphone' },
          { label: 'Cloud Recording', value: model.cloudRecording, isCompatible: model.cloudRecording === 'Yes', icon: 'cloud' }
        ]
      });
    }

    // Categories for Smart Home Lighting
    if (category.includes('lighting')) {
      categories.push({
        name: 'Smart Home Integration',
        icon: 'lightbulb',
        items: [
          { label: 'Google Assistant', value: model.googleAssistant, isCompatible: model.googleAssistant === 'Yes', icon: 'assistant' },
          { label: 'Amazon Alexa', value: model.amazonAlexa, isCompatible: model.amazonAlexa === 'Yes', icon: 'speaker' },
          { label: 'Smart Home App Required', value: model.smartHomeAppRequired, isCompatible: model.smartHomeAppRequired === 'Yes', icon: 'smartphone' },
          { label: 'Mobile App', value: model.mobileAppCompatible, isCompatible: model.mobileAppCompatible === 'Yes', icon: 'phone_android' }
        ]
      });

      categories.push({
        name: 'Power & Connectivity',
        icon: 'power',
        items: [
          { label: 'Power Requirements', value: model.powerRequirements, isCompatible: isCompatible(model.powerRequirements), icon: 'electrical_services' },
          { label: 'WiFi Type', value: model.wifiType, isCompatible: isCompatible(model.wifiType), icon: 'wifi' },
          { label: 'WiFi Required', value: model.wifiRequired, isCompatible: model.wifiRequired === 'Yes', icon: 'network_wifi' }
        ]
      });
    }

    // Categories for Smart Home Plugs
    if (category.includes('plug')) {
      categories.push({
        name: 'Smart Home Integration',
        icon: 'power',
        items: [
          { label: 'Google Assistant', value: model.googleAssistant, isCompatible: model.googleAssistant === 'Yes', icon: 'assistant' },
          { label: 'Amazon Alexa', value: model.amazonAlexa, isCompatible: model.amazonAlexa === 'Yes', icon: 'speaker' },
          { label: 'Smart Home App Required', value: model.smartHomeAppRequired, isCompatible: model.smartHomeAppRequired === 'Yes', icon: 'smartphone' },
          { label: 'Mobile App', value: model.mobileAppCompatible, isCompatible: model.mobileAppCompatible === 'Yes', icon: 'phone_android' }
        ]
      });

      categories.push({
        name: 'Specifications',
        icon: 'settings',
        items: [
          { label: 'Power Requirements', value: model.powerRequirements, isCompatible: isCompatible(model.powerRequirements), icon: 'electrical_services' },
          { label: 'WiFi Type', value: model.wifiType, isCompatible: isCompatible(model.wifiType), icon: 'wifi' },
          { label: 'WiFi Required', value: model.wifiRequired, isCompatible: model.wifiRequired === 'Yes', icon: 'network_wifi' },
          { label: 'Max Range', value: model.maxRange, isCompatible: isCompatible(model.maxRange), icon: 'signal_cellular_alt' },
          { label: 'Weatherproof', value: model.weatherproofRating, isCompatible: isCompatible(model.weatherproofRating), icon: 'water_drop' }
        ]
      });
    }

    // Categories for Smart Home Security
    if (category.includes('security')) {
      categories.push({
        name: 'Security Features',
        icon: 'security',
        items: [
          { label: 'Motion Detection', value: model.motionDetection, isCompatible: isCompatible(model.motionDetection), icon: 'motion_sensor_active' },
          { label: 'Pro Monitoring Available', value: model.proMonitoringAvailable, isCompatible: isCompatible(model.proMonitoringAvailable), icon: 'verified_user' },
          { label: 'Smart Home App Required', value: model.smartHomeAppRequired, isCompatible: model.smartHomeAppRequired === 'Yes', icon: 'smartphone' }
        ]
      });

      categories.push({
        name: 'Connectivity',
        icon: 'wifi',
        items: [
          { label: 'WiFi Type', value: model.wifiType, isCompatible: isCompatible(model.wifiType), icon: 'network_wifi' },
          { label: 'WiFi Required', value: model.wifiRequired, isCompatible: model.wifiRequired === 'Yes', icon: 'settings_input_antenna' },
          { label: 'Power Requirements', value: model.powerRequirements, isCompatible: isCompatible(model.powerRequirements), icon: 'power' }
        ]
      });

      categories.push({
        name: 'Smart Home Integration',
        icon: 'home',
        items: [
          { label: 'Google Assistant', value: model.googleAssistant, isCompatible: model.googleAssistant === 'Yes', icon: 'assistant' },
          { label: 'Amazon Alexa', value: model.amazonAlexa, isCompatible: model.amazonAlexa === 'Yes', icon: 'speaker' },
          { label: 'Mobile App', value: model.mobileAppCompatible, isCompatible: model.mobileAppCompatible === 'Yes', icon: 'phone_android' }
        ]
      });
    }

    // Categories for Audio Accessories
    if (category.includes('audio accessory')) {
      categories.push({
        name: 'Compatibility',
        icon: 'speaker',
        items: [
          { label: 'Works with Roku TV Only', value: model.worksWithRokuTvOnly, isCompatible: isCompatible(model.worksWithRokuTvOnly), icon: 'tv' },
          { label: 'Mobile App', value: model.mobileAppCompatible, isCompatible: model.mobileAppCompatible === 'Yes', icon: 'smartphone' }
        ]
      });

      categories.push({
        name: 'Connectivity',
        icon: 'wifi',
        items: [
          { label: 'WiFi Type', value: model.wifiType, isCompatible: isCompatible(model.wifiType), icon: 'network_wifi' },
          { label: 'WiFi Required', value: model.wifiRequired, isCompatible: model.wifiRequired === 'Yes', icon: 'settings_input_antenna' },
          { label: 'Max Range', value: model.maxRange, isCompatible: isCompatible(model.maxRange), icon: 'signal_cellular_alt' },
          { label: 'Power Requirements', value: model.powerRequirements, isCompatible: isCompatible(model.powerRequirements), icon: 'power' }
        ]
      });
    }

    // Filter out categories with no items and items with "Unknown" values
    return categories.map(cat => ({
      ...cat,
      items: cat.items.filter(item => item.value !== 'Unknown' && item.value.trim() !== '')
    })).filter(cat => cat.items.length > 0);
  });

  ngOnInit(): void {
    this.loadRokuData();
  }

  loadRokuData(): void {
    // Parse the CSV data - helper function to normalize values
    const normalizeValue = (value: string): string => {
      if (!value || value.trim() === '' || value.toUpperCase() === 'N/A') {
        return 'Unknown';
      }
      return value;
    };

    // Full CSV data with all 49 columns
    const csvData = `Model,Product Type,Category,Voice Remote Compatible,Voice Remote Pro Compatible,Apple AirPlay,Apple HomeKit,Min Roku OS AirPlay/HomeKit,4K Support,HDR Support,Dolby Vision Support,Bluetooth Audio Streaming,Bluetooth Headphone Mode,Ethernet Adapter Support,Apple TV Channel,Gaming Console Compatible,Google Assistant,Amazon Alexa,Netflix Games on TV,Ambient Light Sensor,Fast TV Start,HDMI-CEC Support,Compatible Ethernet Adapters,Wireless Speakers Compatible,Wireless Bass Compatible,Remote Finder Feature,Rechargeable Remote,Hands-Free Voice,Mobile App Compatible,Lost Remote Finder Button,Built-in Ethernet,WiFi Required,Power Requirements,Battery Powered,Charge Time,Battery Life,WiFi Type,Smart Home App Required,Pro Monitoring Available,Works with Roku TV Only,Max Range,Weatherproof Rating,Video Resolution,Night Vision,Two-Way Audio,Motion Detection,Sound Detection,Cloud Recording with Subscription,Smart Detection,Siren Feature,MicroSD Support
3840X,Roku Streaming Stick,Streaming Player,Yes,Yes,No,No,N/A,No,No,No,No,Yes,Yes,No,Yes,Yes,Yes,No,No,No,Yes,USB-C to Ethernet (10/100 Mbps),No,No,No,No,No,Yes,No,No,Yes,AC Power,No,N/A,N/A,N/A,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
3830X,Roku Streaming Stick Plus,Streaming Player,Yes,Yes,No,No,N/A,Yes,Yes,No,No,Yes,Yes,No,Yes,Yes,Yes,No,No,No,Yes,USB-C to Ethernet (10/100 Mbps),No,No,No,No,No,Yes,No,No,Yes,AC Power,No,N/A,N/A,N/A,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
3600,Roku Streaming Stick,Streaming Player,Yes,No,No,No,N/A,No,No,No,No,No,No,Yes,Yes,Yes,Yes,No,No,No,Yes,No,No,No,No,No,No,Yes,No,No,Yes,AC Power,No,N/A,N/A,N/A,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
3800,Roku Streaming Stick,Streaming Player,Yes,No,No,No,N/A,No,No,No,No,No,No,Yes,Yes,Yes,Yes,No,No,No,Yes,No,No,No,No,No,No,Yes,No,No,Yes,AC Power,No,N/A,N/A,N/A,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
3810,Roku Streaming Stick+,Streaming Player,Yes,Yes,Yes,Yes,9.4,Yes,Yes,No,No,No,No,Yes,Yes,Yes,Yes,No,No,No,Yes,No,No,No,No,No,No,Yes,No,No,Yes,AC Power,No,N/A,N/A,N/A,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
3811,Roku Streaming Stick+,Streaming Player,Yes,Yes,Yes,Yes,9.4,Yes,Yes,No,No,No,No,Yes,Yes,Yes,Yes,No,No,No,Yes,No,No,No,No,No,No,Yes,No,No,Yes,AC Power,No,N/A,N/A,N/A,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
3820,Roku Streaming Stick 4K,Streaming Player,Yes,Yes,Yes,Yes,9.4,Yes,Yes,No,No,No,No,Yes,Yes,Yes,Yes,No,No,No,Yes,No,No,No,No,No,No,Yes,No,No,Yes,AC Power,No,N/A,N/A,N/A,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
3821,Roku Streaming Stick 4K+,Streaming Player,Yes,Yes,Yes,Yes,9.4,Yes,Yes,No,No,No,No,Yes,Yes,Yes,Yes,No,No,No,Yes,No,No,No,No,No,No,Yes,No,No,Yes,AC Power,No,N/A,N/A,N/A,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
3900,Roku Express,Streaming Player,Yes,No,No,No,N/A,No,No,No,No,No,No,Yes,Yes,Yes,Yes,No,No,No,Yes,No,No,No,No,No,No,Yes,No,No,Yes,AC Power,No,N/A,N/A,N/A,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
3930,Roku Express,Streaming Player,Yes,No,No,No,N/A,No,No,No,No,No,No,Yes,Yes,Yes,Yes,No,No,No,Yes,No,No,No,No,No,No,Yes,No,No,Yes,AC Power,No,N/A,N/A,N/A,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
3960,Roku Express,Streaming Player,Yes,No,No,No,N/A,No,No,No,No,No,Yes,Yes,Yes,Yes,Yes,No,No,No,Yes,Micro USB to Ethernet (10/100 Mbps),No,No,No,No,No,Yes,No,No,Yes,AC Power,No,N/A,N/A,N/A,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
3960RS,Roku Express,Streaming Player,Yes,No,No,No,N/A,No,No,No,No,No,No,Yes,Yes,Yes,Yes,No,No,No,Yes,No,No,No,No,No,No,Yes,No,No,Yes,AC Power,No,N/A,N/A,N/A,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
3910,Roku Express+,Streaming Player,Yes,No,No,No,N/A,No,No,No,No,No,No,Yes,Yes,Yes,Yes,No,No,No,Yes,No,No,No,No,No,No,Yes,No,No,Yes,AC Power,No,N/A,N/A,N/A,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
3931,Roku Express+,Streaming Player,Yes,No,No,No,N/A,No,No,No,No,No,No,Yes,Yes,Yes,Yes,No,No,No,Yes,No,No,No,No,No,No,Yes,No,No,Yes,AC Power,No,N/A,N/A,N/A,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
3932,Roku HD,Streaming Player,Yes,No,No,No,N/A,No,No,No,No,No,Yes,Yes,Yes,Yes,Yes,No,No,No,Yes,Micro USB to Ethernet (10/100 Mbps),No,No,No,No,No,Yes,No,No,Yes,AC Power,No,N/A,N/A,N/A,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
3940,Roku Express 4K,Streaming Player,Yes,No,Yes,Yes,9.4,Yes,Yes,No,No,No,Yes,Yes,Yes,Yes,Yes,Yes,No,No,Yes,Micro USB to Ethernet (10/100 Mbps),No,No,No,No,No,Yes,No,No,Yes,AC Power,No,N/A,N/A,N/A,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
3941,Roku Express 4K+,Streaming Player,Yes,No,Yes,Yes,9.4,Yes,Yes,No,No,No,Yes,Yes,Yes,Yes,Yes,No,No,No,Yes,Micro USB to Ethernet (10/100 Mbps),No,No,No,No,No,Yes,No,No,Yes,AC Power,No,N/A,N/A,N/A,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
3920,Roku Premiere,Streaming Player,Yes,No,Yes,Yes,9.4,Yes,Yes,No,No,No,No,Yes,Yes,Yes,Yes,No,No,No,Yes,No,No,No,No,No,No,Yes,No,No,Yes,AC Power,No,N/A,N/A,N/A,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
4620,Roku Premiere,Streaming Player,Yes,No,Yes,Yes,9.4,Yes,Yes,No,No,No,No,Yes,Yes,Yes,Yes,No,No,No,Yes,No,No,No,No,No,No,Yes,No,No,Yes,AC Power,No,N/A,N/A,N/A,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
3921,Roku Premiere+,Streaming Player,Yes,No,Yes,Yes,9.4,Yes,Yes,No,No,No,No,Yes,Yes,Yes,Yes,No,No,No,Yes,No,No,No,No,No,No,Yes,No,No,Yes,AC Power,No,N/A,N/A,N/A,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
4630,Roku Premiere+,Streaming Player,Yes,No,Yes,Yes,9.4,Yes,Yes,No,No,No,No,Yes,Yes,Yes,Yes,No,No,No,Yes,No,No,No,No,No,No,Yes,No,No,Yes,AC Power,No,N/A,N/A,N/A,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
4600,Roku Ultra,Streaming Player,Yes,No,Yes,Yes,9.4,Yes,Yes,No,No,No,No,Yes,Yes,Yes,Yes,No,No,No,Yes,No,No,No,No,No,No,Yes,No,Yes,Yes,AC Power,No,N/A,N/A,N/A,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
4640,Roku Ultra,Streaming Player,Yes,No,Yes,Yes,9.4,Yes,Yes,No,No,No,No,Yes,Yes,Yes,Yes,No,No,No,Yes,No,No,No,No,No,No,Yes,No,Yes,Yes,AC Power,No,N/A,N/A,N/A,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
4660,Roku Ultra,Streaming Player,Yes,No,Yes,Yes,9.4,Yes,Yes,No,No,No,No,Yes,Yes,Yes,Yes,No,No,No,Yes,No,No,No,No,No,No,Yes,No,Yes,Yes,AC Power,No,N/A,N/A,N/A,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
4661,Roku Ultra,Streaming Player,Yes,No,Yes,Yes,9.4,Yes,Yes,No,No,No,No,Yes,Yes,Yes,Yes,No,No,No,Yes,No,No,No,No,No,No,Yes,No,Yes,Yes,AC Power,No,N/A,N/A,N/A,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
4670,Roku Ultra,Streaming Player,Yes,No,Yes,Yes,9.4,Yes,Yes,No,No,No,No,Yes,Yes,Yes,Yes,No,No,No,Yes,No,No,No,No,No,No,Yes,No,Yes,Yes,AC Power,No,N/A,N/A,N/A,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
4800,Roku Ultra,Streaming Player,Yes,Yes,Yes,Yes,9.4,Yes,Yes,No,Yes,No,No,Yes,Yes,Yes,Yes,No,No,No,Yes,No,No,No,Yes,No,No,Yes,Yes,Yes,Yes,AC Power,No,N/A,N/A,N/A,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
4802,Roku Ultra,Streaming Player,Yes,Yes,Yes,Yes,9.4,Yes,Yes,No,Yes,No,No,Yes,Yes,Yes,Yes,No,No,No,Yes,No,No,No,Yes,No,No,Yes,Yes,Yes,Yes,AC Power,No,N/A,N/A,N/A,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
4850,Roku Ultra,Streaming Player,Yes,Yes,Yes,Yes,9.4,Yes,Yes,No,Yes,No,No,Yes,Yes,Yes,Yes,No,No,No,Yes,No,No,No,Yes,Yes,Yes,Yes,Yes,Yes,Yes,AC Power,No,N/A,N/A,N/A,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
4662,Roku Ultra LT,Streaming Player,Yes,No,Yes,Yes,9.4,Yes,Yes,No,No,No,No,Yes,Yes,Yes,Yes,No,No,No,Yes,No,No,No,No,No,No,Yes,No,Yes,Yes,AC Power,No,N/A,N/A,N/A,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
4801,Roku Ultra LT,Streaming Player,Yes,Yes,Yes,Yes,9.4,Yes,Yes,No,Yes,No,No,Yes,Yes,Yes,Yes,No,No,No,Yes,No,No,No,Yes,No,No,Yes,Yes,Yes,Yes,AC Power,No,N/A,N/A,N/A,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
4210,Roku 2,Streaming Player,Yes,No,No,No,N/A,No,No,No,No,No,No,Yes,Yes,Yes,Yes,No,No,No,Yes,No,No,No,No,No,No,Yes,No,Yes,Yes,AC Power,No,N/A,N/A,N/A,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
4205,Roku 2,Streaming Player,Yes,No,No,No,N/A,No,No,No,No,No,No,Yes,Yes,Yes,Yes,No,No,No,Yes,No,No,No,No,No,No,Yes,No,Yes,Yes,AC Power,No,N/A,N/A,N/A,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
4200,Roku 3,Streaming Player,Yes,No,No,No,N/A,No,No,No,No,No,No,Yes,Yes,Yes,Yes,No,No,No,Yes,No,No,No,No,No,No,Yes,No,Yes,Yes,AC Power,No,N/A,N/A,N/A,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
4230,Roku 3,Streaming Player,Yes,No,No,No,N/A,No,No,No,No,No,No,Yes,Yes,Yes,Yes,No,No,No,Yes,No,No,No,No,No,No,Yes,No,Yes,Yes,AC Power,No,N/A,N/A,N/A,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
4400,Roku 4,Streaming Player,Yes,No,No,No,N/A,Yes,No,No,No,No,No,No,Yes,Yes,Yes,No,No,No,Yes,No,No,No,No,No,No,Yes,No,Yes,Yes,AC Power,No,N/A,N/A,N/A,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
440,Roku 4,Streaming Player,Yes,No,Yes,Yes,10.0,Yes,No,No,No,No,No,No,Yes,Yes,Yes,No,No,No,Yes,No,No,No,No,No,No,Yes,No,Yes,Yes,AC Power,No,N/A,N/A,N/A,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
9104R,Roku Streambar SE,Soundbar,Yes,No,No,No,N/A,No,No,No,Yes,Yes,Yes,No,Yes,Yes,Yes,No,No,Yes,Yes,USB Type A to Ethernet (10/100 Mbps),No,No,No,No,No,Yes,No,No,Yes,AC Power,No,N/A,N/A,2.4GHz,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
9102,Roku Streambar,Soundbar,Yes,No,Yes,Yes,9.4,No,No,No,Yes,Yes,Yes,Yes,Yes,Yes,Yes,No,No,Yes,Yes,USB Type A to Ethernet (10/100 Mbps),No,No,No,No,No,Yes,No,No,Yes,AC Power,No,N/A,N/A,2.4GHz,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
9101R2,Roku Streambar Pro,Soundbar,Yes,No,Yes,Yes,9.4,No,No,No,Yes,Yes,Yes,Yes,Yes,Yes,Yes,No,No,Yes,Yes,USB Type A to Ethernet (10/100 Mbps),No,No,No,No,No,Yes,No,No,Yes,AC Power,No,N/A,N/A,2.4GHz,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
9101,Roku Smart Soundbar,Soundbar,Yes,No,Yes,Yes,9.4,No,No,No,Yes,Yes,Yes,Yes,Yes,Yes,Yes,No,No,Yes,Yes,USB Type A to Ethernet (10/100 Mbps),No,No,No,No,No,Yes,No,No,Yes,AC Power,No,N/A,N/A,2.4GHz,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
9100,onn. Roku Smart Soundbar,Soundbar,Yes,No,Yes,Yes,9.4,No,No,No,Yes,Yes,Yes,Yes,Yes,Yes,Yes,No,No,Yes,Yes,USB Type A to Ethernet (10/100 Mbps),No,No,No,No,No,Yes,No,No,Yes,AC Power,No,N/A,N/A,2.4GHz,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
3700,Roku Express,Streaming Player,Yes,No,Yes,Yes,10.0,No,No,No,No,No,No,No,Yes,Yes,Yes,No,No,No,Yes,No,No,No,No,No,No,Yes,No,No,Yes,AC Power,No,N/A,N/A,N/A,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
3710,Roku Express+,Streaming Player,Yes,No,Yes,Yes,10.0,No,No,No,No,No,No,No,Yes,Yes,Yes,No,No,No,Yes,No,No,No,No,No,No,Yes,No,No,Yes,AC Power,No,N/A,N/A,N/A,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
7000X,Roku TV,Television,Yes,Varies,Yes,Yes,9.4,Varies,Varies,Varies,Varies,Varies,No,Yes,Yes,Yes,Yes,No,Varies,Yes,Yes,No,Yes (some models),Yes (some models),Varies,No,No,Yes,Panel Button,No,Yes,AC Power,No,N/A,N/A,N/A,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
C000X,Roku TV,Television,Yes,Varies,Yes,Yes,9.4,Varies,Varies,Varies,Varies,Varies,No,Yes,Yes,Yes,Yes,No,Varies,Yes,Yes,No,Yes (some models),Yes (some models),Varies,No,No,Yes,Panel Button,No,Yes,AC Power,No,N/A,N/A,N/A,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
C000GB,Roku TV,Television,Yes,Varies,Yes,Yes,9.4,Varies,Varies,Varies,Varies,Varies,No,Yes,Yes,Yes,Yes,No,Varies,Yes,Yes,No,Yes (some models),Yes (some models),Varies,No,No,Yes,Panel Button,No,Yes,AC Power,No,N/A,N/A,N/A,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
8000X,Roku TV,Television,Yes,Varies,Yes,Yes,9.4,Varies,Varies,Varies,Varies,Varies,No,Yes,Yes,Yes,Yes,No,Varies,Yes,Yes,No,Yes (some models),Yes (some models),Varies,No,No,Yes,Panel Button,No,Yes,AC Power,No,N/A,N/A,N/A,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
A000X,Roku TV,Television,Yes,Varies,Yes,Yes,9.4,Varies,Varies,Varies,Varies,Varies,No,Yes,Yes,Yes,Yes,No,Varies,Yes,Yes,No,Yes (some models),Yes (some models),Varies,No,No,Yes,Panel Button,No,Yes,AC Power,No,N/A,N/A,N/A,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
6000X,Roku TV,Television,Yes,Varies,Yes,Yes,9.4,Varies,Varies,Varies,Varies,Varies,No,Yes,Yes,Yes,Yes,No,Varies,Yes,Yes,No,Yes (some models),Yes (some models),Varies,No,No,Yes,Panel Button,No,Yes,AC Power,No,N/A,N/A,N/A,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
5XXX,Roku TV,Television,Yes,Varies,Yes,Yes,10.0,Varies,Varies,Varies,Varies,Varies,No,No,Yes,Yes,Yes,No,Varies,Yes,Yes,No,Yes (some models),Yes (some models),Varies,No,No,Yes,Panel Button,No,Yes,AC Power,No,N/A,N/A,N/A,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
G000GB,Roku TV,Television,Yes,Yes,Yes,Yes,N/A,Yes,Varies,Varies,Varies,Varies,No,Yes,Yes,Yes,Yes,Yes,Varies,Yes,Yes,No,Yes (some models),Yes (some models),Yes,Varies,Varies,Yes,Panel Button,No,Yes,AC Power,No,N/A,N/A,N/A,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
G000X,Roku TV,Television,Yes,Yes,Yes,Yes,N/A,Yes,Varies,Varies,Varies,Varies,No,Yes,Yes,Yes,Yes,Yes,Varies,Yes,Yes,No,Yes (some models),Yes (some models),Yes,Varies,Varies,Yes,Panel Button,No,Yes,AC Power,No,N/A,N/A,N/A,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
R4CX,Roku Select Series 4K (2025),Television,Yes,Yes,Yes,Yes,N/A,Yes,Varies,Varies,Yes,Yes,No,Yes,Yes,Yes,Yes,Yes,Varies,Yes,Yes,No,Yes,Yes,Yes,Yes,Yes,Yes,Panel Button,No,Yes,AC Power,No,N/A,N/A,N/A,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
R2CX,Roku Select Series (2025),Television,Yes,Yes,Yes,Yes,N/A,No,No,No,Yes,Yes,No,Yes,Yes,Yes,Yes,No,Varies,Yes,Yes,No,Yes,Yes,Yes,Yes,Yes,Yes,Panel Button,No,Yes,AC Power,No,N/A,N/A,N/A,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
R6CX,Roku Plus Series (2025),Television,Yes,Yes,Yes,Yes,N/A,Yes,Yes,Yes,Yes,Yes,No,Yes,Yes,Yes,Yes,No,Varies,Yes,Yes,No,Yes,Yes,Yes,Yes,Yes,Yes,Panel Button,No,Yes,AC Power,No,N/A,N/A,N/A,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
R8CX,Roku Pro Series (2025),Television,Yes,Yes,Yes,Yes,N/A,Yes,Yes,Yes,Yes,Yes,No,Yes,Yes,Yes,Yes,No,Yes,Yes,Yes,No,Yes,Yes,Yes,Yes,Yes,Yes,Find Remote Button,No,Yes,AC Power,No,N/A,N/A,N/A,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
R8BX,Roku Pro Series (2025),Television,Yes,Yes,Yes,Yes,N/A,Yes,Yes,Yes,Yes,Yes,No,Yes,Yes,Yes,Yes,No,Yes,Yes,Yes,No,Yes,Yes,Yes,Yes,Yes,Yes,Find Remote Button,No,Yes,AC Power,No,N/A,N/A,N/A,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
SCB11X,Roku Battery Camera,Smart Home Camera,No,No,No,No,N/A,No,No,No,No,No,No,No,No,Yes,Yes,No,No,No,No,No,No,No,No,No,No,Yes (Smart Home App),No,No,Yes,5V/2A USB charging,Yes,2-5 hours,Up to 6 months,2.4GHz + WiFi 6,Yes,No,No,N/A,IP65,1080p Full HD,Color Night Vision,Yes,Yes,Yes,Yes,Yes (Person/Pet/Object),No,No
SCB12R,Roku Battery Camera Plus,Smart Home Camera,No,No,No,No,N/A,No,No,No,No,No,No,No,No,Yes,Yes,No,No,No,No,No,No,No,No,No,No,Yes (Smart Home App),No,No,Yes,5V/2A USB charging,Yes,8-20 hours,Up to 2 years,2.4GHz + WiFi 6,Yes,No,No,N/A,IP65,1080p Full HD,Color Night Vision,Yes,Yes,Yes,Yes,Yes (Person/Pet/Object),No,No
CP1000,Roku Indoor Camera 360° SE,Smart Home Camera,No,No,No,No,N/A,No,No,No,No,No,No,No,No,Yes,Yes,No,No,No,No,No,No,No,No,No,No,Yes (Smart Home App),No,No,Yes,5V/2A USB or AC adapter,No,N/A,N/A,2.4GHz,Yes,No,No,N/A,No,Full HD,Color Night Vision,Yes,Yes,Yes,Yes,Yes (Person/Pet/Object),Yes (Intruder Siren),Yes (MicroSD)
SCW11X,Roku Outdoor Wired Camera (Latest),Smart Home Camera,No,No,No,No,N/A,No,No,No,No,No,No,No,No,Yes,Yes,No,No,No,No,No,No,No,No,No,No,Yes (Smart Home App),No,No,Yes,12.5ft cable + AC adapter,No,N/A,N/A,2.4GHz,Yes,No,No,N/A,IP65,Full HD,Color Night Vision,Yes,Yes,Yes,Yes,Yes (Person/Pet/Package/Vehicle),Yes (Intruder Siren),No
SCW11R,Roku Outdoor Wired Camera (WDR),Smart Home Camera,No,No,No,No,N/A,No,No,No,No,No,No,No,No,Yes,Yes,No,No,No,No,No,No,No,No,No,No,Yes (Smart Home App),No,No,Yes,12.5ft cable + AC adapter,No,N/A,N/A,2.4GHz,Yes,No,No,N/A,IP65,Full HD,Color Night Vision + WDR,Yes,Yes,Yes,Yes,Yes (Person/Pet/Package/Vehicle),Yes (Intruder Siren),No
DS1000,Roku Video Doorbell & Chime SE,Smart Home Doorbell,No,No,No,No,N/A,No,No,No,No,No,No,No,No,Yes,Yes,No,No,No,No,No,No,No,No,No,No,Yes (Smart Home App),No,No,Yes,16-24V/10VA hardwired,No,N/A,N/A,2.4GHz,Yes,No,No,N/A,No,Full HD,Color Night Vision,Yes,Yes,Yes,Yes,Yes (Person/Pet/Object),No,No
DB1000R,Roku Wire-free Video Doorbell & Chime SE,Smart Home Doorbell,No,No,No,No,N/A,No,No,No,No,No,No,No,No,Yes,Yes,No,No,No,No,No,No,No,No,No,No,Yes (Smart Home App),No,No,Yes,Internal Li-ion battery or 16-24V hardwired,Yes,4 hours,3-6 months,2.4GHz,Yes,No,No,N/A,No,Full HD,Color Night Vision,Yes,Yes,Yes,Yes,Yes (Person/Pet/Object),No,No
SL16SE,Roku Smart Light Strip SE (16ft),Smart Home Lighting,No,No,No,No,N/A,No,No,No,No,No,No,No,No,Yes,Yes,No,No,No,No,No,No,No,No,No,No,Yes (Smart Home App),No,No,Yes,12V power adapter,No,N/A,N/A,2.4GHz,Yes,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
SL32SE,Roku Smart Light Strip SE (32ft),Smart Home Lighting,No,No,No,No,N/A,No,No,No,No,No,No,No,No,Yes,Yes,No,No,No,No,No,No,No,No,No,No,Yes (Smart Home App),No,No,Yes,12V power adapter,No,N/A,N/A,2.4GHz,Yes,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
SL16PLUS,Roku Smart Light Strip+ SE (16ft),Smart Home Lighting,No,No,No,No,N/A,No,No,No,No,No,No,No,No,Yes,Yes,No,No,No,No,No,No,No,No,No,No,Yes (Smart Home App),No,No,Yes,12V power adapter,No,N/A,N/A,2.4GHz,Yes,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
SL32PLUS,Roku Smart Light Strip+ SE (32ft),Smart Home Lighting,No,No,No,No,N/A,No,No,No,No,No,No,No,No,Yes,Yes,No,No,No,No,No,No,No,No,No,No,Yes (Smart Home App),No,No,Yes,12V power adapter,No,N/A,N/A,2.4GHz,Yes,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
PS1000,Roku Indoor Smart Plug SE,Smart Home Plug,No,No,No,No,N/A,No,No,No,No,No,No,No,No,Yes,Yes,No,No,No,No,No,No,No,No,No,No,Yes (Smart Home App),No,No,Yes,120V/15A AC outlet,No,N/A,N/A,2.4GHz,Yes,No,No,N/A,No (Indoor only),N/A,No,No,No,No,No,No,No,No
PW1000,Roku Outdoor Smart Plug SE,Smart Home Plug,No,No,No,No,N/A,No,No,No,No,No,No,No,No,Yes,Yes,No,No,No,No,No,No,No,No,No,No,Yes (Smart Home App),No,No,Yes,120V/15A GFCI outlet,No,N/A,N/A,2.4GHz,Yes,No,No,300ft range,Yes (Weatherproof),N/A,No,No,No,No,No,No,No,No
HMS-SE,Roku Home Monitoring System SE,Smart Home Security,No,No,No,No,N/A,No,No,No,No,No,No,No,No,Yes,Yes,No,No,No,No,No,No,No,No,No,No,Yes (Smart Home App),No,No,Yes,Micro-USB + AC adapter or Ethernet,No,N/A,N/A,2.4GHz,Yes,Yes (Noonlight),No,N/A,No,N/A,No,No,No,Yes (sensors),No,No,No,No
9020R2,Roku Wireless Speakers,Audio Accessory,No,No,No,No,N/A,No,No,No,No,No,No,No,No,No,No,No,No,No,No,No,N/A,N/A,No,No,No,Yes,No,No,Yes,AC Power per speaker,No,N/A,N/A,2.4GHz,No,No,Yes (Roku TV/Streambar/Soundbar),30ft range,No,N/A,No,No,No,No,No,No,No,No
9030,Roku TV Wireless Speakers,Audio Accessory,No,No,No,No,N/A,No,No,No,No,No,No,No,No,No,No,No,No,No,No,No,N/A,N/A,No,No,No,Yes,No,No,Yes,AC Power per speaker,No,N/A,N/A,2.4GHz,No,No,Yes (Roku TV only),30ft range,No,N/A,No,No,No,No,No,No,No,No
9040,onn. Roku Wireless Surround Speakers,Audio Accessory,No,No,No,No,N/A,No,No,No,No,No,No,No,No,No,No,No,No,No,No,No,N/A,N/A,No,No,No,Yes,No,No,Yes,AC Power per speaker,No,N/A,N/A,2.4GHz,No,No,Yes (Roku TV/Streambar/Soundbar),30ft range,No,N/A,No,No,No,No,No,No,No,No
WB-ROKU,Roku Wireless Bass,Audio Accessory,No,No,No,No,N/A,No,No,No,No,No,No,No,No,No,No,No,No,No,No,No,N/A,N/A,No,No,No,Yes,No,No,Yes,AC Power,No,N/A,N/A,2.4GHz,No,No,Yes (Roku TV/Streambar/Soundbar),30ft range,No,N/A,No,No,No,No,No,No,No,No
WBP-ROKU,Roku Wireless Bass Pro,Audio Accessory,No,No,No,No,N/A,No,No,No,No,No,No,No,No,No,No,No,No,No,No,No,N/A,N/A,No,No,No,Yes,No,No,Yes,AC Power,No,N/A,N/A,2.4GHz,No,No,Yes (Roku TV/Streambar/Soundbar),30ft range,No,N/A,No,No,No,No,No,No,No,No
TVWSB,Roku TV Wireless Soundbar,Audio Accessory,No,No,No,No,N/A,No,No,No,No,No,No,No,No,No,No,No,No,No,No,No,N/A,N/A,No,No,No,Yes,No,No,Yes,AC Power,No,N/A,N/A,2.4GHz,No,No,Yes (Roku TV only),N/A,No,N/A,No,No,No,No,No,No,No,No
R2CX,Roku Select Series (2025),Roku TV,Yes,Yes,Yes,Yes,N/A,No,No,No,Yes,Yes,No,Yes,Yes,Yes,Yes,No,Varies,Yes,Yes,No,Yes,Yes,Yes,Yes,Yes,Yes,Panel Button,No,Yes,AC Power,No,N/A,N/A,N/A,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
R4CX,Roku Select Series 4K (2025),Roku TV,Yes,Yes,Yes,Yes,N/A,Yes,Varies,Varies,Yes,Yes,No,Yes,Yes,Yes,Yes,Yes,Varies,Yes,Yes,No,Yes,Yes,Yes,Yes,Yes,Yes,Panel Button,No,Yes,AC Power,No,N/A,N/A,N/A,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
R6CX,Roku Plus Series (2025),Roku TV,Yes,Yes,Yes,Yes,N/A,Yes,Yes,Yes,Yes,Yes,No,Yes,Yes,Yes,Yes,No,Varies,Yes,Yes,No,Yes,Yes,Yes,Yes,Yes,Yes,Panel Button,No,Yes,AC Power,No,N/A,N/A,N/A,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
R8CX,Roku Pro Series (2025),Roku TV,Yes,Yes,Yes,Yes,N/A,Yes,Yes,Yes,Yes,Yes,No,Yes,Yes,Yes,Yes,No,Yes,Yes,Yes,No,Yes,Yes,Yes,Yes,Yes,Yes,Find Remote Button,No,Yes,AC Power,No,N/A,N/A,N/A,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
R8BX,Roku Pro Series (2025),Roku TV,Yes,Yes,Yes,Yes,N/A,Yes,Yes,Yes,Yes,Yes,No,Yes,Yes,Yes,Yes,No,Yes,Yes,Yes,No,Yes,Yes,Yes,Yes,Yes,Yes,Find Remote Button,No,Yes,AC Power,No,N/A,N/A,N/A,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
5XXX-Series,Legacy HD/FHD TVs (2015-2017),Roku TV,Yes,No,Limited,Limited,10.0+,No,No,No,No,No,No,Yes,Yes,Yes,Yes,No,Varies,No,Yes,No,Limited,Limited,Varies,No,No,Yes,Varies,Varies,Yes,AC Power,No,N/A,N/A,N/A,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
6XXX-Series,Early UHD TVs (2016-2017),Roku TV,Yes,No,Yes,Yes,9.4,Yes,Yes,Varies,No,No,No,Yes,Yes,Yes,Yes,No,Varies,Varies,Yes,No,Some Models,Some Models,Varies,No,No,Yes,Varies,Varies,Yes,AC Power,No,N/A,N/A,N/A,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
7XXX-Series,Mainstream UHD TVs (2017-2019),Roku TV,Yes,No,Yes,Yes,9.4,Yes,Yes,Varies,Varies,Varies,No,Yes,Yes,Yes,Yes,No,Varies,Varies,Yes,No,Some Models,Some Models,Varies,No,No,Yes,Varies,Varies,Yes,AC Power,No,N/A,N/A,N/A,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
8XXX-Series,Midrange HD/FHD TVs (2017-2020),Roku TV,Yes,No,Varies,Varies,9.4 or 10.0,Varies,Varies,No,No,No,No,Yes,Yes,Yes,Yes,No,Varies,Varies,Yes,No,Limited,Limited,Varies,No,No,Yes,Varies,Varies,Yes,AC Power,No,N/A,N/A,N/A,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
AXXX-Series,Reno Platform UHD (2020-2021),Roku TV,Yes,Possibly,Yes,Yes,9.4,Yes,Yes,Varies,Likely,Varies,No,Yes,Yes,Yes,Yes,Varies,Varies,Likely,Yes,No,Yes,Yes,Varies,Varies,Varies,Yes,Varies,Varies,Yes,AC Power,No,N/A,N/A,N/A,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
CXXX-Series,Malone Platform UHD (2019-2021),Roku TV,Yes,Possibly,Yes,Yes,9.4,Yes,Yes,Varies,Varies,Varies,No,Yes,Yes,Yes,Yes,Varies,Varies,Varies,Yes,No,Yes,Yes,Varies,Varies,Varies,Yes,Varies,Varies,Yes,AC Power,No,N/A,N/A,N/A,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
DXXX-Series,Roma Platform HD/FHD (2020-2021),Roku TV,Yes,No,Varies,Varies,9.4,Varies,Varies,No,No,No,No,Yes,Yes,Yes,Yes,No,Varies,Varies,Yes,No,Some Models,Some Models,Varies,No,No,Yes,Varies,Varies,Yes,AC Power,No,N/A,N/A,N/A,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
EXXX-Series,Bandera 8K Platform (2021),Roku TV,Yes,Yes,Yes,Yes,9.4,Yes,Yes,Yes,Yes,Likely,No,Yes,Yes,Yes,Yes,Varies,Varies,Likely,Yes,No,Yes,Yes,Varies,Varies,Varies,Yes,Varies,Varies,Yes,AC Power,No,N/A,N/A,N/A,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No
GXXX-Series,Athens Platform UHD (2021-2022),Roku TV,Yes,Possibly,Yes,Yes,9.4,Yes,Yes,Varies,Likely,Likely,No,Yes,Yes,Yes,Yes,Varies,Varies,Likely,Yes,No,Yes,Yes,Varies,Varies,Varies,Yes,Varies,Varies,Yes,AC Power,No,N/A,N/A,N/A,No,No,No,N/A,No,N/A,No,No,No,No,No,No,No,No`;

    const lines = csvData.split('\n');
    const headers = lines[0].split(',');

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      if (values.length >= 49) {
        this.rokuModels.push({
          model: normalizeValue(values[0]),
          productType: normalizeValue(values[1]),
          category: normalizeValue(values[2]),
          voiceRemoteCompatible: normalizeValue(values[3]),
          voiceRemoteProCompatible: normalizeValue(values[4]),
          appleAirPlay: normalizeValue(values[5]),
          appleHomeKit: normalizeValue(values[6]),
          minRokuOSAirPlayHomeKit: normalizeValue(values[7]),
          fourKSupport: normalizeValue(values[8]),
          hdrSupport: normalizeValue(values[9]),
          dolbyVisionSupport: normalizeValue(values[10]),
          bluetoothAudioStreaming: normalizeValue(values[11]),
          bluetoothHeadphoneMode: normalizeValue(values[12]),
          ethernetAdapterSupport: normalizeValue(values[13]),
          appleTvChannel: normalizeValue(values[14]),
          gamingConsoleCompatible: normalizeValue(values[15]),
          googleAssistant: normalizeValue(values[16]),
          amazonAlexa: normalizeValue(values[17]),
          netflixGamesOnTv: normalizeValue(values[18]),
          ambientLightSensor: normalizeValue(values[19]),
          fastTvStart: normalizeValue(values[20]),
          hdmiCecSupport: normalizeValue(values[21]),
          compatibleEthernetAdapters: normalizeValue(values[22]),
          wirelessSpeakersCompatible: normalizeValue(values[23]),
          wirelessBassCompatible: normalizeValue(values[24]),
          remoteFinderFeature: normalizeValue(values[25]),
          rechargeableRemote: normalizeValue(values[26]),
          handsFreeVoice: normalizeValue(values[27]),
          mobileAppCompatible: normalizeValue(values[28]),
          lostRemoteFinderButton: normalizeValue(values[29]),
          builtInEthernet: normalizeValue(values[30]),
          wifiRequired: normalizeValue(values[31]),
          powerRequirements: normalizeValue(values[32]),
          batteryPowered: normalizeValue(values[33]),
          chargeTime: normalizeValue(values[34]),
          batteryLife: normalizeValue(values[35]),
          wifiType: normalizeValue(values[36]),
          smartHomeAppRequired: normalizeValue(values[37]),
          proMonitoringAvailable: normalizeValue(values[38]),
          worksWithRokuTvOnly: normalizeValue(values[39]),
          maxRange: normalizeValue(values[40]),
          weatherproofRating: normalizeValue(values[41]),
          videoResolution: normalizeValue(values[42]),
          nightVision: normalizeValue(values[43]),
          twoWayAudio: normalizeValue(values[44]),
          motionDetection: normalizeValue(values[45]),
          soundDetection: normalizeValue(values[46]),
          cloudRecording: normalizeValue(values[47]),
          smartDetection: normalizeValue(values[48]),
          sirenFeature: normalizeValue(values[49]),
          microSdSupport: normalizeValue(values[50])
        });
      }
    }
  }

  clearSearch(event: Event): void {
    event.stopPropagation();
    this.searchTerm.set('');
  }

  toggleCategory(categoryId: string): void {
    const currentCategories = this.categories();

    if (categoryId === 'all') {
      // If "All" is clicked, select only "All"
      this.categories.set(currentCategories.map(cat => ({
        ...cat,
        selected: cat.id === 'all'
      })));
    } else {
      // If any other category is clicked, deselect "All" and toggle the clicked category
      this.categories.set(currentCategories.map(cat => {
        if (cat.id === 'all') {
          return { ...cat, selected: false };
        } else if (cat.id === categoryId) {
          return { ...cat, selected: !cat.selected };
        }
        return cat;
      }));

      // If no categories are selected after toggle, select "All"
      const anySelected = this.categories().filter(c => c.id !== 'all' && c.selected).length > 0;
      if (!anySelected) {
        this.categories.set(currentCategories.map(cat => ({
          ...cat,
          selected: cat.id === 'all'
        })));
      }
    }
  }
}
