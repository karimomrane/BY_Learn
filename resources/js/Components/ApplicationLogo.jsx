export default function ApplicationLogo({ variant = 'auto', className = '', ...props }) {
    // variant can be 'light', 'dark', or 'auto' (default)
    // 'auto' will use dark logo on light backgrounds and light logo on dark backgrounds

    const logoSrc = variant === 'light'
        ? '/logo/light.png'
        : variant === 'dark'
        ? '/logo/dark.png'
        : '/logo/dark.png'; // default to dark for auto

    const darkModeSrc = variant === 'auto' ? '/logo/light.png' : logoSrc;

    return (
        <>
            {variant === 'auto' ? (
                <>
                    <img
                        {...props}
                        src={logoSrc}
                        className={`${className} dark:hidden`}
                        alt="Logo"
                    />
                    <img
                        {...props}
                        src={darkModeSrc}
                        className={`${className} hidden dark:block`}
                        alt="Logo"
                    />
                </>
            ) : (
                <img
                    {...props}
                    src={logoSrc}
                    className={className}
                    alt="Logo"
                />
            )}
        </>
    );
}
