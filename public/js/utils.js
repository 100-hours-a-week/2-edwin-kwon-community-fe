const utils = {
    // 숫자 포맷팅
    formatNumber(number) {
        if (number >= 100000) return `${Math.floor(number / 1000)}k`;
        if (number >= 10000) return `${Math.floor(number / 1000)}k`;
        if (number >= 1000) return `${Math.floor(number / 1000)}k`;
        return number.toString();
    },

    // 날짜 포맷팅
    formatDate(dateString) {
        const date = new Date(dateString);
        return date
            .toLocaleString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
            })
            .replace(/\./g, '-')
            .replace(/\s/g, '')
            .replace(',', '');
    },
};

export default utils;
