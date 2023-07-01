## Wymagania

```bash
npx --version #8.3.1
npx ts-node --version #v10.7.0
npm modules:
    fs, prompt, node-math-bigint
```

## Pliki

`rsa.ts` - plik wczytujący argumenty i wykonujący operacje rsa (najważniejsze są linijki 76-83)

`run` - skrypt do szybkiego uruchamiania programu

`tsconfig.json` - plik konfiguracyjny kompilatora typescript'u

## Użycie

```bash
npx ts-node rsa.ts #uruchomienie programu [argumenty są podawane wewnątrz]
./run [s/c/sf/cf] [argumenty] #uruchomienie skryptu z argumentami podanymi w linii komend
```

Gdzie [argumenty do typu]:

1. s - wykonanie standardowego rsa po argumentach [x, n, e]
1. c - wykonanie rsa z crt po argumentach [x, p, q, dp, dq, qi]
1. sf - rsa z pliku [x, plik]
1. cf - rsa z crt z pliku [x, plik]
