import { Types } from 'mongoose'

// Common 3D vector interface
export interface IVector3 {
  x: number
  y: number
  z: number
}

// Unified transform: position, rotation, scale
export interface ITransform {
  position: IVector3
  rotation: IVector3
  scale: IVector3
}

// Material override types (no wall/floor)
export enum MaterialOverrideType {
  Color = 'color',
  Texture = 'texture',
  Image = 'image'
}

// Material override value
export interface IMaterialOverride {
  type: MaterialOverrideType
  value: string
  mediaId?: Types.ObjectId
}

// Component configuration entry for a model
export interface IComponentConfig {
  componentKey: string
  meshIds: string[]
  displayName: string
  supportedMaterialTypes: MaterialOverrideType[]
  defaultMaterial: IMaterialOverride
}
