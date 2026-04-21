export interface IDiploma {
  id: string;
  title: string;
  description: string;
  image: string | null;
  immutable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IDiplomaMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IDiplomasPayload {
  data: IDiploma[];
  metadata: IDiplomaMetadata;
}

export interface ICreateDiplomaFields {
  title: string;
  description: string;
  image?: string;
}

export interface IUpdateDiplomaFields {
  title?: string;
  description?: string;
  image?: string;
}
