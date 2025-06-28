
export type DeviceType =
  | "material_sensor"
  | "weather_sensor"
  | "equipment_sensor"
  | "safety_sensor"
  | "progress_sensor";

export type DeviceData =
  | {
      material_type: string;
      current_level: number;
      capacity: number;
      unit: string;
      threshold_low: number;
      threshold_critical: number;
    }
  | {
      temperature: number;
      humidity: number;
      wind_speed: number;
      precipitation: number;
      visibility: number;
      conditions: string;
      wind_threshold: number;
      rain_threshold: number;
    }
  | {
      equipment_type: string;
      operational_hours: number;
      fuel_level: number;
      engine_temperature: number;
      hydraulic_pressure: number;
      maintenance_due_hours: number;
      status: string;
      efficiency: number;
    }
  | {
      personnel_count: number;
      safety_violations: number;
      noise_level: number;
      air_quality_index: number;
      emergency_exits_clear: boolean;
      ppe_compliance: number;
      noise_threshold: number;
      aqi_threshold: number;
    }
  | {
      task_name: string;
      completion_percentage: number;
      expected_completion: number;
      variance: number;
      quality_score: number;
      worker_productivity: number;
      material_usage_efficiency: number;
    };

export type IoTDevice = {
  device_id: string;
  device_name: string;
  device_type: DeviceType;
  location: string;
  status: "active" | "maintenance";
  last_reading: string;
  battery_level: number;
  signal_strength: number;
  data: DeviceData;
};

export type IoTSystem = {
  devices: IoTDevice[];
  security: {
    encryption_enabled: boolean;
    protocol: string;
    last_security_audit: string;
    certificates_valid: boolean;
    data_integrity_verified: boolean;
  };
  network: {
    gateway_status: string;
    total_devices: number;
    active_devices: number;
    offline_devices: number;
    maintenance_devices: number;
    data_transmission_rate: string;
    average_latency: string;
  };
};
