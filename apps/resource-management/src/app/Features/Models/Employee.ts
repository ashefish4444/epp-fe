import { Address } from "./address.model";
import { EmployeeOrganization } from "./EmployeeOrganization/EmployeeOrganization";
import { FamilyDetail } from "./FamilyDetail/FamilyDetailModel";
import { IEmergencyContact } from "./emergencycontact";
import { Nationality } from "./Nationality";

export interface Employee{
  guid?:string,
  employeeNumber:string,
  FirstName: string,
  FatherName: string,
  GrandFatherName: string,
  MobilePhone: string,
  Phone1: string,
  Phone2: string,
  PersonalEmail: string,
  PersonalEmail2: string,
  PersonalEmail3: string,
  DateofBirth : Date,
  Gender : string,
  Nationality?: Nationality[],
  Organization?: EmployeeOrganization,
  PersonalAddress?: Address[],
  FamilyDetails?: FamilyDetail[],
  EmployeeOrganization?: EmployeeOrganization,
  EmployeeAddress?: Address[],
  EmergencyContact?: IEmergencyContact[]

}
