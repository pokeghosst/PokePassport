import bcrypt from "bcrypt";

interface Account {
  accountId: string;
  email: string;
  passwordHash: string;
}

const accounts = new Map<string, Account>();

export async function findAccount(ctx: any, id: string) {
  const account = accounts.get(id);
  if (!account) return undefined;

  return {
    accountId: id,
    async claims() {
      return { sub: id, email: account.email };
    },
  };
}

export async function authenticate(email: string, password: string) {
  for (const account of accounts.values()) {
    if (account.email === email) {
      const valid = await bcrypt.compare(password, account.passwordHash);
      if (valid) {
        return account;
      }
    }
  }
  return null;
}

export async function register(email: string, password: string) {
  const passwordHash = await bcrypt.hash(password, 10);
  const accountId = String(accounts.size + 1);
  const account: Account = { accountId, email, passwordHash };
  accounts.set(accountId, account);
  return account;
}
