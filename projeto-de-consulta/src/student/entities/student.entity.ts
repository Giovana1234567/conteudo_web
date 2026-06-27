import { ObjectId } from 'mongodb';
import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity()
export class StudentEntity {
  @ObjectIdColumn() // Diferente no MongoDB
  _id: ObjectId; // Diferente no MongoDB

  @Column()
  name: string;

  @Column() // Diferente no MongoDB
  address: {
    street: string,
    streetNumber: number,
    city: string,
    state: string,
  };

  @Column() // Diferente no MongoDB
  listContacts: {
    name: string,
    phoneNumber: string,
  }[];

  @Column()
  courseId: ObjectId; // Diferente no MongoDB
}
