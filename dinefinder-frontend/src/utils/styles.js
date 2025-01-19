export const customStyles = {
    control: (base) => ({
        ...base,
        height: '38px', // Match the height of the search inputs
        minHeight: '38px',
        width: '200px',
        fontSize: '1rem',
        boxShadow: 'none',
        backgroundcolor: '#f9f9f9',
        color: '#888',
        borderRadius: '0',
        '&:hover': {
            borderColor: '#FFBF00',
        },
    }),
    menu: (base) => ({
        ...base,
        marginTop: 0,
        zIndex: 9999,
    }),
    option: (base, { isFocused, isSelected }) => ({
        ...base,
        padding: '8px 12px',
        fontSize: '1rem',
        borderRadius: '0',
        backgroundColor: isFocused
            ? '#FFBF00'
            : isSelected
            ? '#8A9A5B'
            : 'white',
        color: isFocused || isSelected ? 'white' : '#333',
        cursor: 'pointer',
        '&:active': {
            backgroundColor: '#CC7722',
        },
    }),
    menuPortal: (base) => ({
        ...base,
        zIndex: 9999,
    }),
    dropdownIndicator: (base) => ({
        ...base,
        display: 'none',
    }),
    indicatorSeparator: (base) => ({
        ...base,
        display: 'none',
    })
};
