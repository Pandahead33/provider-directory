export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  speciality: string;
  practiceName: string;
  /* eslint-disable */
  // to access fields by using [fieldName], this needs to accept
  // any type, which eslint will always warn about
  [key: string]: any;
  /* eslint-enable */
}
