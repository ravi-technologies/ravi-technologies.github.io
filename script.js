document.addEventListener('DOMContentLoaded', () => {
    let scheduleChapterUpdate = () => {};
    const isExamplesPage = Boolean(document.querySelector('.examples-content'));
    const exampleLinks = document.querySelectorAll('.example-link');
    const detailedExamples = document.querySelectorAll('.example-reservoir .detailed-example');
    const exampleStack = document.querySelector('.examples-stack');
    const exampleDisplay = document.getElementById('example-display');
    const exampleTemplates = {};
    let hasInitializedExample = false;

    detailedExamples.forEach(example => {
        if (example.id) {
            exampleTemplates[example.id] = example;
        }
    });

    // Section filtering for examples page
    if (isExamplesPage) {
        const sectionLinks = document.querySelectorAll('.chapter-nav .chapter-link[data-section]');
        const indexGroups = document.querySelectorAll('.index-group[data-section]');

        const filterBySection = (section) => {
            // Update active link
            sectionLinks.forEach(link => {
                link.classList.toggle('active', link.dataset.section === section);
            });

            // Show/hide index groups
            indexGroups.forEach(group => {
                if (group.dataset.section === section) {
                    group.style.display = 'block';
                } else {
                    group.style.display = 'none';
                }
            });
        };

        sectionLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                filterBySection(section);

                // Show first example from this section
                const firstExample = document.querySelector(`.index-group[data-section="${section}"] .example-link`);
                if (firstExample) {
                    firstExample.click();
                }
            });
        });

        // Initialize with first section
        if (sectionLinks.length > 0 && !window.location.hash) {
            filterBySection('scale-advice');
        }
    }
    const chapterLinks = document.querySelectorAll('.chapter-link');
    chapterLinks.forEach(link => {
        if (!link.dataset.chapterLink) {
            const hash = link.getAttribute('href');
            if (hash && hash.startsWith('#')) {
                link.dataset.chapterLink = hash.slice(1);
            }
        }
    });

    const initDiffBlock = (block) => {
        if (!block || block.dataset.diffInitialized === 'true') {
            return;
        }

        const toggles = block.querySelectorAll('.comparison-toggle');
        const pairs = block.querySelectorAll('.diff-pair');
        if (!toggles.length || !pairs.length) {
            return;
        }

        const setActiveScenario = (scenario) => {
            toggles.forEach(button => {
                const isActive = button.dataset.scenario === scenario;
                button.classList.toggle('active', isActive);
                button.setAttribute('aria-pressed', String(isActive));
            });

            pairs.forEach(pair => {
                pair.classList.toggle('active', pair.dataset.scenario === scenario);
            });
        };

        toggles.forEach(button => {
            button.addEventListener('click', () => setActiveScenario(button.dataset.scenario));
        });

        block.dataset.diffInitialized = 'true';
    };

    const setActiveCategoryNav = (categoryId) => {
        if (!categoryId) {
            return;
        }

        chapterLinks.forEach(link => {
            const target = link.dataset.chapterLink || (link.getAttribute('href') || '').replace('#', '');
            link.classList.toggle('active', target === categoryId);
        });
    };

    const showExample = (targetId, options = {}) => {
        if (!exampleDisplay || !targetId) {
            return;
        }
        const { scrollToStack = false, updateHash = true } = options;
        const template = exampleTemplates[targetId];
        if (!template) {
            return;
        }

        const parentCategory = template.closest('.example-category');
        const instance = template.cloneNode(true);
        instance.removeAttribute('id');

        exampleDisplay.innerHTML = '';
        exampleDisplay.appendChild(instance);

        const newDiffBlocks = instance.querySelectorAll('.interactive-diff');
        newDiffBlocks.forEach(block => initDiffBlock(block));

        if (window.Prism && typeof window.Prism.highlightAllUnder === 'function') {
            window.Prism.highlightAllUnder(instance);
        }

        exampleLinks.forEach(link => {
            const linkId = link.dataset.chapterLink || '';
            link.classList.toggle('active', linkId === targetId);
        });

        if (isExamplesPage && parentCategory && parentCategory.id) {
            setActiveCategoryNav(parentCategory.id);
        }

        if (scrollToStack && exampleStack) {
            exampleStack.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        if (updateHash) {
            if (history.replaceState) {
                history.replaceState(null, '', `#${targetId}`);
            } else {
                window.location.hash = targetId;
            }
        }

        scheduleChapterUpdate();
        hasInitializedExample = true;
    };

    const hashTargetId = window.location.hash ? window.location.hash.slice(1) : '';
    if (hashTargetId) {
        const hashElement = document.getElementById(hashTargetId);
        const hashExample = hashElement
            ? (hashElement.classList.contains('detailed-example') ? hashElement : hashElement.closest('.detailed-example'))
            : null;
        if (hashExample && hashExample.id) {
            showExample(hashExample.id, { scrollToStack: false, updateHash: false });
        }
    }

    if (!hasInitializedExample && exampleLinks.length) {
        const fallbackId = exampleLinks[0].dataset.chapterLink || exampleLinks[0].getAttribute('href').slice(1);
        showExample(fallbackId, { scrollToStack: false, updateHash: false });
    }
    // Smooth scrolling for on-page anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            const targetId = link.getAttribute('href').slice(1);
            if (!targetId) {
                return;
            }

            if (link.classList.contains('example-link')) {
                event.preventDefault();
                showExample(targetId);
                return;
            }

            const targetElement = document.getElementById(targetId);
            if (!targetElement) {
                return;
            }

            if (targetElement.classList.contains('example-category')) {
                if (!targetElement.classList.contains('active-category')) {
                    const firstExample = targetElement.querySelector('.detailed-example');
                    if (firstExample) {
                        event.preventDefault();
                        showExample(firstExample.id, { scrollToStack: true });
                        return;
                    }
                }
            }

            const exampleWrapper = targetElement.closest('.detailed-example');
            if (exampleWrapper && !exampleWrapper.classList.contains('active-example')) {
                showExample(exampleWrapper.id, { scrollToStack: true });
                event.preventDefault();
                return;
            }

            event.preventDefault();
            targetElement.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Subtle fade-in for cards when they enter the viewport
    const observedCards = document.querySelectorAll('.feature-card, .problem-card, .objection-card, .trust-card, .audience-card');
    if ('IntersectionObserver' in window && observedCards.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, { threshold: 0.15 });

        observedCards.forEach(card => observer.observe(card));
    }

    // Mobile navigation toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenuLinks = document.querySelector('.nav-links');

    if (mobileMenuToggle && navMenuLinks) {
        const closeMenu = () => {
            mobileMenuToggle.classList.remove('active');
            navMenuLinks.classList.remove('active');
        };

        mobileMenuToggle.addEventListener('click', (event) => {
            event.stopPropagation();
            mobileMenuToggle.classList.toggle('active');
            navMenuLinks.classList.toggle('active');
        });

        navMenuLinks.addEventListener('click', (event) => {
            if (event.target.tagName === 'A') {
                closeMenu();
            }
        });

        document.addEventListener('click', (event) => {
            const clickedOutside = !mobileMenuToggle.contains(event.target) && !navMenuLinks.contains(event.target);
            if (clickedOutside) {
                closeMenu();
            }
        });
    }

    // Chapter link highlighting (top pills + example index)
    if (!isExamplesPage) {
        const sectionOrder = Array.from(document.querySelectorAll('[data-chapter-section]'));

        const buildSectionList = (links) => {
            const sections = [];
            links.forEach(link => {
                const hash = link.getAttribute('href');
                const explicitId = link.dataset.chapterLink;
                const targetId = explicitId || (hash && hash.startsWith('#') ? hash.slice(1) : null);
                if (!targetId) {
                    return;
                }
                link.dataset.chapterLink = targetId;
                const target = document.getElementById(targetId);
                if (target && !sections.includes(target)) {
                    sections.push(target);
                }
            });
            sections.sort((a, b) => sectionOrder.indexOf(a) - sectionOrder.indexOf(b));
            return sections;
        };

        const navSections = buildSectionList(chapterLinks);
        const exampleSections = buildSectionList(exampleLinks);

        const createHighlighter = (sections, links) => {
            if (!sections.length || !links.length) {
                return () => {};
            }

            return () => {
                const offset = window.scrollY + 160;
                let currentId = null;
                sections.forEach(section => {
                    if (section.offsetParent === null) {
                        return;
                    }
                    if (currentId === null) {
                        currentId = section.id;
                    }
                    if (offset >= section.offsetTop) {
                        currentId = section.id;
                    }
                });
                if (!currentId) {
                    currentId = sections[0].id;
                }
                links.forEach(link => {
                    const matches = link.dataset.chapterLink === currentId;
                    link.classList.toggle('active', matches);
                });
            };
        };

        const runNavHighlight = createHighlighter(navSections, chapterLinks);
        const runExampleHighlight = createHighlighter(exampleSections, exampleLinks);
        const runChapterHighlights = () => {
            runNavHighlight();
            runExampleHighlight();
        };

        if (navSections.length || exampleSections.length) {
            runChapterHighlights();
            let ticking = false;
            window.addEventListener('scroll', () => {
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        runChapterHighlights();
                        ticking = false;
                    });
                    ticking = true;
                }
            });
            scheduleChapterUpdate = runChapterHighlights;
        }
    }

    document.querySelectorAll('.interactive-diff').forEach(block => {
        if (!block.closest('.example-reservoir')) {
            initDiffBlock(block);
        }
    });

    // FAQ card click handling - make entire card clickable
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.addEventListener('click', (event) => {
            // Don't trigger if clicking on a link inside the FAQ
            if (event.target.tagName === 'A') {
                return;
            }

            // Find the summary element and toggle the details
            const summary = item.querySelector('summary');
            if (summary && event.target !== summary) {
                // If clicked anywhere except the summary, toggle the open state
                event.preventDefault();
                item.open = !item.open;
            }
        });
    });
});
