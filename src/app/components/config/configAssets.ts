import { UserConfigCategories } from 'src/app/enums';

export interface DefaultValues {
  category: UserConfigCategories;
  defaultIssue: string;
  defaultComment: string | null;
}

interface DropdownData {
  label: string;
  value: string;
}
export const categoryDropdownData: DropdownData[] = [
  { label: 'Implementation', value: UserConfigCategories.implementation },
  { label: 'Testing', value: UserConfigCategories.test },
  { label: 'Organizing', value: UserConfigCategories.organizing },
];