export const GENERATE_RADIX_COLORS_SIGNATURE = 'generateRadixColors($appearance, $accent, $gray, $background)';
import * as sass from 'sass';
import { generateRadixColors } from './generateRadixColors';

type Data = ReturnType<typeof generateRadixColors>;

export default function (
    appearance: sass.types.String,
    accent: sass.types.String,
    gray: sass.types.String,
    background: sass.types.String,
) {
    if (!(appearance.getValue() === 'light' || appearance.getValue() === 'dark')) return;

    const result = {
        ...generateRadixColors({
            appearance: appearance.getValue() as 'light' | 'dark',
            accent: accent.getValue(),
            gray: gray.getValue(),
            background: background.getValue(),
        }),
        grayContrast: '#ffffffff',
    };
    
    const map = new sass.types.Map(Object.keys(result).length);
    let index = 0;
    for (const key in result) {
        if (result.hasOwnProperty(key)) {
            const value = result[key as keyof Data];
            
            map.setKey(index, new sass.types.String(key));

            if (Array.isArray(value)) {
                const innerMap = new sass.types.List(value.length);
                for (let i = 0; i < value.length; i++) {
                    innerMap.setValue(i, new sass.types.String(value[i]));
                }
                map.setValue(index, innerMap);
            } else {
                map.setValue(index, new sass.types.String(value));
            }

            index++;
        }
    }

    return map;
}
