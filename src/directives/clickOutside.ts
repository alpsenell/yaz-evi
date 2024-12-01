import { Directive } from "vue";

const clickOutside: Directive = {
  beforeMount(el: HTMLElement, binding: { value: (event: MouseEvent) => void }) {
    el.clickOutsideEvent = (event: MouseEvent) => {
      // Check if the click is outside the element
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value(event);
      }
    };
    document.addEventListener("click", el.clickOutsideEvent);
  },
  unmounted(el: HTMLElement) {
    document.removeEventListener("click", el.clickOutsideEvent);
  },
};

export default clickOutside;
