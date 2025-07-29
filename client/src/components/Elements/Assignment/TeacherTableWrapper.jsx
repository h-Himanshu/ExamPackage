import React from 'react';
import { useParams } from 'react-router-dom';
import TeacherTable from './teacherTable';

export default function TeacherTableWrapper(props) {
  const params = useParams();
  return <TeacherTable {...props} id={params.id} />;
}
