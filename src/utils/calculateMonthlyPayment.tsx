export function calculateMonthlyPayment({
  priceOfDeposit,
  percentOfDeposit,
  annualInterestRate,
  durationInMonths,
  typeOfPayment,
  m = 1,
  type = "default",
}: {
  priceOfDeposit: number;
  percentOfDeposit: number;
  annualInterestRate: number;
  durationInMonths: number;
  typeOfPayment: string;
  m?: number;
  type: "default" | "micro-loan";
}): number {
  const initialPayment =
    type === "default" ? (priceOfDeposit * percentOfDeposit) / 100 : 0;
  const loanAmount = priceOfDeposit - initialPayment;
  const monthlyRate = annualInterestRate / 12 / 100;

  if (typeOfPayment === "DIFFERENTIAL") {
    const principalPart = loanAmount / durationInMonths;
    const interestPart = (loanAmount - principalPart * (m - 1)) * monthlyRate;
    const monthlyPayment = principalPart + interestPart;
    return monthlyPayment;
  }
  if (monthlyRate === 0) {
    const monthlyPayment = loanAmount / durationInMonths;
    return monthlyPayment;
  }

  const numerator = monthlyRate * Math.pow(1 + monthlyRate, durationInMonths);
  const denominator = Math.pow(1 + monthlyRate, durationInMonths) - 1;
  const monthlyPayment = loanAmount * (numerator / denominator);
  return monthlyPayment;
}
