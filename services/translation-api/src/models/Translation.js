import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('translations')
export class Translation {
  @PrimaryGeneratedColumn('uuid')
  id;

  @Column('text')
  text;

  @Column('text', { nullable: true })
  translatedText;

  @Column('varchar', { length: 10 })
  sourceLang;

  @Column('varchar', { length: 10 })
  targetLang;

  @Column('varchar', { length: 20, default: 'pending' })
  status; // pending, processing, completed, failed

  @CreateDateColumn()
  createdAt;

  @UpdateDateColumn()
  updatedAt;
}
