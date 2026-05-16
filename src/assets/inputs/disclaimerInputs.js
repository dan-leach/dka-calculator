// Form 0 — Legal disclaimer

export const disclaimerInputs = {
  legalAgreement: {
    val: false,
    label: "Agreement to legal disclaimer",
    info: "Your agreement to the legal disclaimer is recorded.",
    form: [0],
    isValid() {
      return this.val;
    },
  },
};
