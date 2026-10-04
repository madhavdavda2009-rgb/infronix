export const EMPLOYMENT_TYPES = ['Founder', 'Co-Founder', 'Employee', 'Freelancer', 'Contractor', 'Intern'];

export function leadershipLabel(person) {
  if (person.employment_type === 'Co-Founder') return 'Co-Founder';
  if (person.is_founder || person.employment_type === 'Founder') return 'Founder';
  return null;
}
