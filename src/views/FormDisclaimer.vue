<script setup>
import { onMounted } from "vue";
import { data } from "../assets/data.js";
import router from "../router";

/**
 * Function to handle the 'Continue' button click event
 * Sets the legal agreement to true and navigates to the patient details form.
 */
const continueClick = () => {
  data.value.inputs.legalAgreement.val = true;
  router.push("/form-patient-details");
};

/**
 * Lifecycle hook that runs when the component is mounted.
 * Ensures the page is scrolled to the top.
 */
onMounted(() => {
  // Scroll to the top of the page
  window.scrollTo(0, 0);
});
</script>

<template>
  <form id="form-disclaimer" class="container my-4 needs-validation">
    <h2 class="display-3">Legal disclaimer</h2>
    <div>
      <p>
        By using this website and by using the template protocol, and the
        calculation formulae contained within it, you confirm that you accept
        the terms of this disclaimer. If you do not agree to such terms, you
        must not use this site.
      </p>
      <p>
        We are the owner or the licensee of all intellectual property rights in
        our site. Our site is made available free of charge. We do not guarantee
        that our site, or any content on it, will always be available or be
        uninterrupted. We may suspend or withdraw or restrict the availability
        of all or any part of our site for business and operational reasons.
      </p>
      <p>
        Although we make reasonable efforts to check this website, the template
        protocol, and the calculation formulae for accuracy, we make no
        representations, warranties or guarantees, whether express or implied,
        that the content on our site is accurate, complete, free from error or
        up to date, and it remains strictly the treating clinician’s
        responsibility to check the protocol and calculated values produced by
        this website manually. The content on our site is provided for general
        information only. It is not intended to amount to advice on which you
        should rely.
      </p>
      <p>
        The DKA calculator allows a maximum weight for age of +2SDS or 75kg
        (whichever is lower), and a minimum weight for age of -2SDS. There is
        the facility to override these weight limits but clinicians do this at
        their own risk and the BSPED accepts no liability for any adverse
        events. Neither BSPED nor the ICP or website authors accept any
        liability for any errors arising from the use of this tool or protocols
        generated.
      </p>
      <p>
        We exclude all implied conditions, warranties, representations or other
        terms that may apply to our site or any content on it.
      </p>
      <p>
        We will not be liable to you for any loss or damage, whether in
        contract, tort (including negligence), breach of statutory duty, or
        otherwise, even if foreseeable, arising under or in connection with, use
        of, or inability to use, our site; or use of or reliance protocol and
        calculated values produced on our site.
      </p>
      <p>
        We do not guarantee that our site will be secure or free from bugs or
        viruses. You are responsible for configuring your information
        technology, computer programmes and platform to access our site. You
        should use your own virus protection software. You must not misuse our
        site by knowingly introducing viruses, trojans, worms, logic bombs or
        other material that is malicious or technologically harmful.
      </p>
      <p>
        The terms of this disclaimer, its subject matter and its formation (and
        any non-contractual disputes or claims) are governed by English law. By
        using this website and the template protocol, and the calculation
        formulae contained within it, you confirm that you agree to the
        exclusive jurisdiction of the courts of England and Wales.
      </p>
    </div>

    <!--next-->
    <div class="text-center">
      <button
        type="button"
        @click="continueClick"
        class="btn btn-lg btn-primary"
      >
        Agree and continue
      </button>
    </div>
  </form>
</template>

<style scoped>
.container {
  max-width: 750px;
}
.btn-outline-secondary {
  width: 150px;
}
</style>
