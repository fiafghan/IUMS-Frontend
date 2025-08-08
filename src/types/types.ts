import type { JSX } from "react";

export type InternetUser = {
  id: string;
  name: string;
  username: string;
  lastname: string;
  email: string;
  phone: string;
  position?: string;
  employment_type: string;  // Make sure this matches backend field name
  directorate: string;
  deputy: string;
  device_limit: string;
  device_type: string;
  mac_address?: string;
  status?: "active" | "deactive" | 1 | 0;
  violations?: "0" | "1" | "2";
  comment?: string;
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
}

export interface ViolationProps {
  id: string;
  username: string;
  name: string;
  position: string;
  deputyMinistry: string;
  directorate: string;
  user_signature: string;
  directorate_signature: string;
  violations: string;
  comment: string;
  
}

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
  device_type: string;
  mac_address: string;
  status: string; // Add this line
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

