exports.filteredOrder = (order) => {
    return (p1, p2) => {
        for (const critere of order) {
            if (!(critere in p1) || !(critere in p2)) continue;

            if (p1[critere] !== p2[critere]) {
                return p1[critere] > p2[critere] ? 1 : -1;
            }
        }
        return 0;
    };
}