import { EntitySchema } from 'typeorm';

export const Translation = new EntitySchema({
  name: 'Translation',
  tableName: 'translations',
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
    translatedText: {
      type: 'text',
      nullable: true
    },
    sourceLang: {
      type: 'varchar',
      length: 10,
      nullable: false
    },
    targetLang: {
      type: 'varchar',
      length: 10,
      nullable: false
    },
    status: {
      type: 'varchar',
      length: 20,
      default: 'pending'
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
