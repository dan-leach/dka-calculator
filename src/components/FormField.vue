<script setup>
/**
 * FormField — reusable floating-label input for text, number, date, and datetime-local fields.
 *
 * Renders the standard pattern used throughout the DKA Calculator forms:
 *   - Bootstrap floating label + input-group
 *   - Optional unit label (e.g. "kg", "mmol/L") between input and info icon
 *   - Collapsible info panel (data-bs-target derived from fieldId)
 *   - Inline error message shown when showErrors is true and the input has errors
 *
 * Extra HTML attributes (min, max, step, disabled, minlength, maxlength, required, pattern…)
 * are forwarded directly to the <input> element via v-bind="$attrs".
 *
 * @prop {string}  fieldId     - Unique id for the input (also used to link label, info panel, errors)
 * @prop {Object}  input       - The input definition object from data.value.inputs (must have .val, .label, .info, .errors, .isValid())
 * @prop {boolean} showErrors  - Whether validation errors should currently be shown
 * @prop {string}  [type]      - HTML input type (default: "text")
 * @prop {string}  [unit]      - Optional unit label rendered between the input and the info icon (e.g. "kg")
 */
defineOptions({ inheritAttrs: false });

defineProps({
  fieldId: {
    type: String,
    required: true,
  },
  input: {
    type: Object,
    required: true,
  },
  showErrors: {
    type: Boolean,
    required: true,
  },
  type: {
    type: String,
    default: "text",
  },
  unit: {
    type: String,
    default: "",
  },
});
</script>

<template>
  <div class="mb-4">
    <div class="input-group">
      <div class="form-floating">
        <input
          :type="type"
          class="form-control"
          :id="fieldId"
          v-model="input.val"
          @change="input.isValid()"
          placeholder="x"
          autocomplete="off"
          v-bind="$attrs"
        />
        <label :for="fieldId">{{ input.label }}</label>
      </div>
      <span v-if="unit" class="input-group-text">{{ unit }}</span>
      <span
        class="input-group-text"
        data-bs-toggle="collapse"
        :data-bs-target="`#${fieldId}Info`"
      >
        <font-awesome-icon :icon="['fas', 'circle-info']" />
      </span>
    </div>
    <div
      v-if="showErrors && input.errors"
      class="form-text text-danger mx-1"
      :id="`${fieldId}Errors`"
    >
      {{ input.errors }}
    </div>
    <div
      class="collapse form-text mx-1"
      :id="`${fieldId}Info`"
      v-html="input.info"
    ></div>
  </div>
</template>
