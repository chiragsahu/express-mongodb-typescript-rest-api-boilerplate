import { ObjectId } from 'mongodb'
import { Model, Document } from 'mongoose'

export interface DbOperationResult<T = any> {
  status: boolean
  message: string
  data?: T
  total_records?: number
  current_page?: number
  per_page?: number
  total_pages?: number
}

/**
 * Create a single record in a collection.
 */
export const createRecord = async <T extends Document>(
  model: Model<any>,
  recordObj: any
): Promise<DbOperationResult<{ inserted_id: ObjectId }>> => {
  try {
    const result = await model.create(recordObj)

    return {
      status: true,
      message: 'Record Created',
      data: { inserted_id: result._id }
    }
  } catch (error: any) {
    return {
      status: false,
      message: error.message
    }
  }
}

/**
 * Create multiple records in a collection.
 */
export const createBulkRecords = async <T extends Document>(
  model: Model<any>,
  recordArrayObj: any[]
): Promise<DbOperationResult> => {
  try {
    await model.insertMany(recordArrayObj)

    return {
      status: true,
      message: 'Records Created'
    }
  } catch (error: any) {
    return {
      status: false,
      message: error.message
    }
  }
}

/**
 * Get all records matching a condition, with optional projection, sort, and pagination.
 * Note: populateConfig is kept only for API compatibility; use aggregate for joins.
 */
export const getAllRecords = async <T extends Document>(
  model: Model<any>,
  condObj: Record<string, any> = {},
  projectObj: Record<string, any> = {},
  sortObj: Record<string, any> = {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  populateConfig?: any,
  paginate?: boolean
): Promise<DbOperationResult<any[]>> => {
  try {
    const { limit = 10, page = 1, ...sortFields } = sortObj
    const numericLimit = Number(limit)
    const numericPage = Number(page)

    if (paginate) {
      const skip = (numericPage - 1) * numericLimit
      const result = await model
        .find(condObj, Object.keys(projectObj).length ? projectObj : undefined)
        .sort(sortFields)
        .skip(skip)
        .limit(numericLimit)
        .lean()

      const total_records = await model.countDocuments(condObj)
      const total_pages = Math.ceil(total_records / numericLimit)

      return {
        status: result.length > 0,
        data: result,
        total_records,
        current_page: numericPage,
        per_page: numericLimit,
        total_pages,
        message: result.length > 0 ? 'Record Found' : 'No Record Found'
      }
    }

    const result = await model
      .find(condObj, Object.keys(projectObj).length ? projectObj : undefined)
      .sort(sortFields)
      .lean()

    return {
      status: result.length > 0,
      data: result,
      message: result.length > 0 ? 'Record Found' : 'No Record Found'
    }
  } catch (error: any) {
    return {
      status: false,
      message: error.message
    }
  }
}

/**
 * Get a single record matching a condition.
 */
export const getRecord = async <T extends Document>(
  model: Model<any>,
  condObj: Record<string, any>,
  projectObj: Record<string, any> = {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  populateConfig?: any
): Promise<DbOperationResult<any | []>> => {
  try {
    const result = await model
      .findOne(condObj, Object.keys(projectObj).length ? projectObj : undefined)
      .lean()

    if (result) {
      return {
        status: true,
        data: result,
        message: 'Record Found'
      }
    }

    return {
      status: false,
      data: [],
      message: 'No Record Found'
    }
  } catch (error: any) {
    return {
      status: false,
      message: error.message
    }
  }
}

/**
 * Update a single record matching a condition.
 */
export const updateRecord = async <T extends Document>(
  model: Model<any>,
  condObj: Record<string, any>,
  updateObj: Record<string, any>
): Promise<DbOperationResult> => {
  try {
    const result = await model.updateOne(condObj, { $set: updateObj })

    if (result.modifiedCount > 0) {
      return {
        status: true,
        data: result,
        message: 'Record Updated'
      }
    }

    return {
      status: false,
      data: [],
      message: 'No Record Found'
    }
  } catch (error: any) {
    return {
      status: false,
      message: error.message
    }
  }
}

/**
 * Update multiple records matching a condition.
 */
export const updateBulkRecords = async <T extends Document>(
  model: Model<any>,
  condObj: Record<string, any>,
  updateObj: Record<string, any>
): Promise<DbOperationResult> => {
  try {
    const result = await model.updateMany(condObj, { $set: updateObj })

    if (result.modifiedCount > 0) {
      return {
        status: true,
        data: result,
        message: 'Records Updated'
      }
    }

    return {
      status: false,
      data: [],
      message: 'No Record Found'
    }
  } catch (error: any) {
    return {
      status: false,
      message: error.message
    }
  }
}

/**
 * Count records matching a condition.
 */
export const countRecords = async <T extends Document>(
  model: Model<any>,
  condObj: Record<string, any>
): Promise<DbOperationResult<number>> => {
  try {
    const result = await model.countDocuments(condObj)

    return {
      status: true,
      data: result,
      message: 'Record Found'
    }
  } catch (error: any) {
    return {
      status: false,
      message: error.message
    }
  }
}

/**
 * Run an aggregation pipeline.
 */
export const aggregateRecordFunction = async <T extends Document>(
  model: Model<any>,
  pipeline: any[]
): Promise<DbOperationResult<any[]>> => {
  try {
    const result = await model.aggregate(pipeline)

    return {
      status: true,
      data: result,
      message: 'Record Found'
    }
  } catch (error: any) {
    return {
      status: false,
      message: error.message
    }
  }
}

/**
 * Delete a single record matching a condition.
 */
export const deleteRecord = async <T extends Document>(
  model: Model<any>,
  condObj: Record<string, any>
): Promise<DbOperationResult> => {
  try {
    const result = await model.deleteOne(condObj)

    if (result.deletedCount > 0) {
      return {
        status: true,
        data: result,
        message: 'Record Deleted'
      }
    }

    return {
      status: false,
      data: [],
      message: 'No Record Found'
    }
  } catch (error: any) {
    return {
      status: false,
      message: error.message
    }
  }
}

/**
 * Delete multiple records matching a condition.
 */
export const deleteBulkRecords = async <T extends Document>(
  model: Model<any>,
  condObj: Record<string, any>
): Promise<DbOperationResult> => {
  try {
    const result = await model.deleteMany(condObj)
    if (result.deletedCount > 0) {
      return {
        status: true,
        data: result,
        message: 'Records Deleted'
      }
    }
    return {
      status: false,
      data: [],
      message: 'No Record Found'
    }
  } catch (error: any) {
    return {
      status: false,
      message: error.message
    }
  }
}

/**
 * Get records by an array of ObjectId strings.
 */
export const getRecordsByIds = async <T extends Document>(
  model: Model<any>,
  idsArray: string[],
  projectObj: Record<string, any> = {}
): Promise<DbOperationResult<any[]>> => {
  try {
    const objectIds = idsArray.map(id => new ObjectId(id))
    const result = await model
      .find(
        { _id: { $in: objectIds } },
        Object.keys(projectObj).length ? projectObj : undefined
      )
      .lean()

    return {
      status: true,
      data: result,
      message: 'Records Found'
    }
  } catch (error: any) {
    return {
      status: false,
      message: error.message
    }
  }
}

/**
 * Delete records by an array of ObjectId strings.
 */
export const deleteRecordsByIds = async <T extends Document>(
  model: Model<any>,
  idsArray: string[]
): Promise<DbOperationResult> => {
  try {
    const objectIds = idsArray.map(id => new ObjectId(id))
    const result = await model.deleteMany({ _id: { $in: objectIds } })

    if (result.deletedCount > 0) {
      return {
        status: true,
        data: result,
        message: 'Records Deleted'
      }
    }

    return {
      status: false,
      data: [],
      message: 'No Records Found'
    }
  } catch (error: any) {
    return {
      status: false,
      message: error.message
    }
  }
}
