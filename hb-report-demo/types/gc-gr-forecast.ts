
export type MonthlyForecast = {
  month: number;
  planned: number;
  actual?: number;
  forecast?: number;
};

export type GcGrForecastEntry = {
  costCode: string;
  description: string;
  budget: number;
  actualToDate: number;
  etc: number;
  eac: number;
  variance: number;
  monthlyForecasts: MonthlyForecast[];
};

export type GcGrForecastData = {
  summary: {
    totalBudget: number;
    totalActualToDate: number;
    totalETC: number;
    totalEAC: number;
    totalVariance: number;
    percentComplete: number;
    performanceIndex: number;
  };
  records: GcGrForecastEntry[];
};
