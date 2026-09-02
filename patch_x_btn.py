with open('src/components/clients/ServiceDetailModal.tsx', 'r') as f:
    text = f.read()

target = """                  </button>
                )}
                <button
                  onClick={onClose}
                  type="button"
                  aria-label="Cerrar expediente"
                  className="p-2 text-neutral-400 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-[#202026] rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>"""

replacement = """                  </button>
                )}
              </div>"""

if target in text:
    with open('src/components/clients/ServiceDetailModal.tsx', 'w') as f:
        f.write(text.replace(target, replacement))
    print("Replaced!")
else:
    print("Target not found")
