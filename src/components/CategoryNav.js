export function CategoryNav(container, categories = []) {
  // Filter out unwanted category
  const mainCats = categories
    .filter(name => name && name.trim() && name.toLowerCase() !== 'chai')
    .map(n => n.trim());

  // Hardcoded subcategory map
  const subcatMap = {
    ALL: ['Wraps & Toasties', 'Super Salad', 'Desserts', 'Drinks'],
    LUNCH: ['Wraps & Toasties', 'Super Salad', 'Desserts', 'Drinks'],
    DINNER: ['Wraps & Toasties', 'Super Salad', 'Desserts', 'Drinks'],
    BREAKFAST: ['Bites'],
  };

  // Clear container
  container.innerHTML = '';
  container.className = 'w-full flex flex-col items-center gap-4';

  // Create main nav bar
  const mainNav = document.createElement('div');
  mainNav.className = 
    'w-full flex flex-wrap justify-center gap-4 ' +
    'bg-brand-500/10 p-4 rounded-xl';
  container.appendChild(mainNav);

  // Create sub nav bar
  const subNav = document.createElement('div');
  subNav.className = 
    'w-full flex flex-wrap justify-center gap-2 ' +
    'bg-brand-500/5 p-2 rounded-lg';
  container.appendChild(subNav);

  let selectedMain = mainCats[0];

  // Helper: render sub-buttons for a given main category
  function renderSubNav(mainName) {
    subNav.innerHTML = '';
    const key = mainName.toUpperCase();
    const subs = subcatMap[key] || [];
    subs.forEach((sub, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = sub;
      btn.dataset.sub = sub;
      // default: first sub active
      btn.className = [
        'px-4 py-2 text-sm font-sans font-medium antialiased tracking-wide rounded-full border transition-colors duration-200',
        i === 0
          ? 'bg-brand-500 text-white border-brand-500'
          : 'bg-white text-neutral-900 border-brand-500 hover:bg-white/90'
      ].join(' ');

      btn.addEventListener('click', () => {
        // toggle active on sub-buttons
        subNav.querySelectorAll('button').forEach(b => {
          if (b === btn) {
            b.classList.remove('bg-white', 'text-neutral-900', 'hover:bg-white/90');
            b.classList.add('bg-brand-500', 'text-white');
          } else {
            b.classList.remove('bg-brand-500', 'text-white');
            b.classList.add('bg-white', 'text-neutral-900', 'border-brand-500', 'hover:bg-white/90');
          }
        });
        // Dispatch subcategory change
        container.dispatchEvent(new CustomEvent('subcategoryChange', {
          detail: sub,
          bubbles: true
        }));
      });

      subNav.appendChild(btn);
    });
    // notify default sub-selection
    if (subs.length) {
      container.dispatchEvent(new CustomEvent('subcategoryChange', {
        detail: subs[0],
        bubbles: true
      }));
    }
  }

  // Build main buttons
  mainCats.forEach((name, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = name;
    btn.dataset.cat = name;

    btn.className = [
      'px-6 py-3 text-lg font-sans font-medium antialiased tracking-wide rounded-full border transition-colors duration-200',
      i === 0
        ? 'bg-brand-500 text-white border-brand-500'
        : 'bg-white text-neutral-900 border-brand-500 hover:bg-white/90'
    ].join(' ');

    btn.addEventListener('click', () => {
      // toggle active state
      mainNav.querySelectorAll('button').forEach(b => {
        if (b === btn) {
          b.classList.remove('bg-white', 'text-neutral-900', 'hover:bg-white/90');
          b.classList.add('bg-brand-500', 'text-white');
        } else {
          b.classList.remove('bg-brand-500', 'text-white');
          b.classList.add('bg-white', 'text-neutral-900', 'border-brand-500', 'hover:bg-white/90');
        }
      });
      selectedMain = name;
      // render its subs
      renderSubNav(selectedMain);
      // Dispatch main category change
      container.dispatchEvent(new CustomEvent('categoryChange', {
        detail: name,
        bubbles: true
      }));
    });

    mainNav.appendChild(btn);
  });

  // Initial render of sub-nav for the first main category
  renderSubNav(selectedMain);
}
