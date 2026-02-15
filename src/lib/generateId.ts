export function generateAccessId(orgPrefix: string, groupName: string) {
  const cleanOrg = orgPrefix.substring(0, 3).toUpperCase();
  const cleanGroup = groupName.substring(0, 4).toUpperCase();
  const randomStr = Math.random().toString(36).substring(2, 5).toUpperCase();
  
  return `${cleanOrg}-${cleanGroup}-${randomStr}`;
}