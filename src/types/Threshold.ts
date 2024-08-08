export type Thresholds = {
  /** Set global thresholds to `100` */
  100?: boolean;
  /** Thresholds for statements */
  statements?: number;
  /** Thresholds for functions */
  functions?: number;
  /** Thresholds for branches */
  branches?: number;
  /** Thresholds for lines */
  lines?: number;
};
