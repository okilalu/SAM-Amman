// User state
export interface User {
  id?: number;
  userId?: string;
  username?: string;
  password?: string;
  credential?: string;
}

export interface UserState {
  user: User | null;
  users: User[] | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface UserResponse {
  data: {
    user: User;
    token?: string;
  };
  token: string | null;
  status: boolean;
  message: string | null;
}

export interface MultiUserResponse {
  status: boolean;
  message: string;
  data: {
    user: User[];
  };
}

// Device state
export interface Device {
  id?: number;
  deviceId?: string;
  samId?: string;
  deviceIP?: string;
  deviceUsername?: string;
  deviceRootFolder?: string;
  cameraIP?: string;
  cameraUsername?: string;
  cameraPassword?: string;
  cameraRootFolder?: string;
  cameraType?: string;
  location?: string;
  speedThreshold?: string;
  speed_limit?: number;
}

export interface DeviceState {
  devices: Device[] | [];
  loading: boolean;
  error: string | null;
  selectedDevice: string | null;
}

export interface DeviceResponse {
  data: {
    device: Device[] | [];
  };
  status: boolean;
  message: string | null;
}

// Data state
export interface Datas {
  id?: number;
  speed?: number;
  video?: string;
  deviceId?: string;
  samId?: string;
  category?: string;
  timestamp?: string;
  minSpeed?: string;
  maxSpeed?: string;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
}

export interface DataState {
  data: Datas[] | [];
  loading: boolean;
  error: string | null;
}

export interface DataResponse {
  data: {
    data: Datas[] | [];
  };
  status: boolean;
  message: string | null;
}

// Raspi State
export interface Raspi {
  samId: string;
  status?: string;
  data?: any;
  speed_limit?: number;
}

export interface RaspiState {
  raspi: Raspi | null;
  loading: boolean;
  error: string | null;
  isConnect: Record<string, boolean>;
  selectedDevice: string | null;
}

// schedule state
export interface Schedules {
  id?: string;
  samIds?: string;
  startTime?: string;
  type?: "daily" | "12h";
  isActive?: boolean;
}

export interface ScheduleState {
  data: Schedules[] | [];
  loading: boolean;
  error: string | null;
}

export interface ScheduleResponse {
  data: Schedules[] | [];
  status: boolean;
  message: string | null;
}
