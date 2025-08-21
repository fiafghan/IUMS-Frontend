import type { JSX } from "react";

export type InternetUser = {
  id: string;
  name: string;
  username: string;
  lastname: string;
  email: string;
  phone: string;
  position?: string;
  employee_type_id: number;  // Make sure this matches backend field name
  employee_type: string;
  employment_type: string;
  directorate_id: number;
  directorate: number;
  deputy: string;
  device_limit: number;
  device_type_id: number;
  mac_address?: string;
  status?: "active" | "deactive" | 1 | 0;
  violation_count?: number;
  comment?: string;
  violation_type_id?: number;
  violation_type?: string;
  group_id: number;
  groups: number;
  devices?: SelectedDevice[]; // Add this line
};


export interface ViolationTypeForm {
  name: string;
}



export interface ViolationType {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role_name: string;
  password?: string;
  role_id: number;
  internet_user_id: number;
}

export interface ViolationProps {
  id: string;
  username: string;
  name: string;
  position: string;
  deputy: string;
  directorate: string;
  user_signature: string;
  directorate_signature: string;
  violations_count: string;
  comment: string;
  
}

export type SelectedDevice = {
  id: string;
  deviceTypeId: number;
  deviceTypeName: string;
  groupId: number;
  groupName: string;
  macAddress: string;
};

export type FormState = {
  name: string;
  last_name: string;
  username: string;
  email: string;
  phone: string;
  employment_type: string;
  directorate: string;
  position: string;
  deputyMinistry: string;
  device_limit: string;
  group_id: number;
  device_type: string;
  mac_address: string;
  status: string;
  selectedDevices: SelectedDevice[]; // Add this
};

export type SelectOption = {
  value: number | string;
  label: string;
};

export type SelectProps = {
  label: string;
  icon: JSX.Element;
  name: string;
  value: string;
  options: SelectOption[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

export type InputProps = {
  label: string;
  icon: JSX.Element;
  name: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  readOnly?: boolean;
};

