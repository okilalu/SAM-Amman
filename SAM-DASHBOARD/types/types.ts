export interface SelectOption {
  value: string;
  label: string;
}

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
export interface Device extends StorageData {
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
  localVideo?: string;
  deviceId?: string;
  samId?: string;
  category?: string;
  timestamp?: string;
  minSpeed?: string;
  maxSpeed?: string;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
  filterValue?: string;
  filterType?: "day" | "month" | "year";
  totalRecords?: number;
  averageSpeed?: number;
  overSpeed?: number;
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
  data?: Datas;
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

// Email state
export interface Email {
  id?: number;
  emailName?: string;
}

export interface EmailState {
  data: Email[];
  selectedEmail: Email | null;
  loading: boolean;
  error: string | null;
}

export interface EmailsResponse {
  data: Email[];
  status: boolean;
  message: string;
}

// Logs State
export interface Log {
  activity: string;
  id: string;
  createdAt: string;
}

export interface LogResponse {
  data: Log[]; // Data log yang dikembalikan oleh API
  status: boolean;
  status_code: number;
  message: string;
}

export interface LogState {
  logs: Log[]; // Semua data log
  loading: boolean; // Status loading saat fetch
  error: string | null; // Menyimpan pesan error
}

// Location state
export interface Location {
  id?: number;
  location?: string;
}

export interface LocationState {
  data: Location[];
  selectedLocation: Location | null;
  loading: boolean;
  error: string | null;
}

export interface LocationResponse {
  data: Location[];
  status: boolean;
  message: string;
}

// User-Device State
export interface UserDevice {
  userId: string;
  samId?: string;
  deviceId: string | string[];
}
export interface UserDeviceState {
  data: UserDevice[];
  loading: boolean;
  error: string | null;
}
export interface UserDeviceResponse {
  data: UserDevice[];
  status: boolean;
  message: string;
}

export interface StorageData {
  path: string;
  total: string;
  used: string;
  free: string;
  usedPercent: string;
  availablePercent: string;
}

export interface SummaryData {
  samId: string;
  totalRecords: number;
  averageSpeed: number;
  overSpeed: number;
}
