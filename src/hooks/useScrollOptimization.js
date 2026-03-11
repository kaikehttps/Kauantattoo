import { useEffect, useRef, useState } from 'react';

const useOtimizacaoScroll = () => {
  const [estaFazendoScroll, setEstaFazendoScroll] = useState(false);
  const timeoutScroll = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setEstaFazendoScroll(true);

      if (timeoutScroll.current) {
        clearTimeout(timeoutScroll.current);
      }

      timeoutScroll.current = setTimeout(() => {
        setEstaFazendoScroll(false);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutScroll.current) {
        clearTimeout(timeoutScroll.current);
      }
    };
  }, []);

  return estaFazendoScroll;
};

export default useOtimizacaoScroll;
