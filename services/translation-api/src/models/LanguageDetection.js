import { EntitySchema } from 'typeorm';

export const LanguageDetection = new EntitySchema({
  name: 'LanguageDetection',
  tableName: 'language_detections',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid'
    },
    text: {
      type: 'text',
      nullable: false
    },
    detectedLanguage: {
      type: 'varchar',
      length: 10,
      nullable: true
    },
    confidence: {
      type: 'float',
      nullable: true
    },
    status: {
      type: 'varchar',
      length: 20,
      default: 'pending'
    },
    provider: {
      type: 'varchar',
      length: 50,
      nullable: true
    },
    errorMessage: {
      type: 'text',
      nullable: true
    },
    createdAt: {
      type: 'timestamp',
      createDate: true
    },
    updatedAt: {
      type: 'timestamp',
      updateDate: true
    }
  }
});
