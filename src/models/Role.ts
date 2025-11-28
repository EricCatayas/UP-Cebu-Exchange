export interface RoleAttributes {
  id: number;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RoleDTO extends Omit<RoleAttributes, 'description'> {}
