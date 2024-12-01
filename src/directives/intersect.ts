import { DirectiveBinding } from 'vue';

const intersect = {
  mounted(el, binding) {
    const options = {
      threshold: binding.value.options?.threshold || 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          binding.value.callback(entries, observer);
        }
      });
    }, options);

    observer.observe(el);
  }
};

export default {
  install(app) {
    app.directive('intersect', intersect);
  }
};
