import bcrypt from "bcrypt";

/**
 * 비밀번호 해시화
 * @param plain - 평문 비밀번호
 * @returns 해시된 비밀번호
 */
export const hashPassword = (plain: string): Promise<string> => {
  return bcrypt.hash(plain, 10);
};

/**
 * 평문과 해시된 비밀번호 비교
 * @param plain - 입력된 평문 비밀번호
 * @param hashed - DB에 저장된 해시 비밀번호
 * @returns 일치 여부 (true/false)
 */
export const comparePassword = (
  plain: string,
  hashed: string
): Promise<boolean> => {
  return bcrypt.compare(plain, hashed);
};
