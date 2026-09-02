#!/bin/bash
# Remove from bottom
sed -i '/{selectedService && (/,/)}/d' src/components/clients/ClientDetail.tsx
sed -i '/{\/\* 5. EXPEDIENTE ESPECÍFICO DEL SERVICIO (MODAL DETALLADO) \*\//d' src/components/clients/ClientDetail.tsx

