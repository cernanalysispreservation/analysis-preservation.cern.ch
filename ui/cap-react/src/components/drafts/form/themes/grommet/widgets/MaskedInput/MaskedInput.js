import React, {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";

import { Box } from "grommet";
import { useForwardedRef, FormContext } from "./utils";
import { Keyboard } from "./Keyboard";

const parseValue = (mask, value) => {
  // break the value up into mask parts
  const valueParts = []; // { part, beginIndex, endIndex }
  let valueIndex = 0;
  let maskIndex = 0;
  while (
    value !== undefined &&
    valueIndex < value.length &&
    maskIndex < mask.length
  ) {
    const item = mask[maskIndex];

    let found;
    if (item.fixed) {
      const { length } = item.fixed;

      // grab however much of value (starting at valueIndex) matches
      // item.fixed. If none matches it and there is more in value
      // add in the fixed item.
      let matching = 0;
      while (
        matching < length &&
        value[valueIndex + matching] === item.fixed[matching]
      ) {
        matching += 1;
      }

      if (matching > 0) {
        let part = value.slice(valueIndex, valueIndex + matching);
        if (valueIndex + matching < value.length) {
          // matched part of the fixed portion but there's more stuff
          // after it. Go ahead and fill in the entire fixed chunk
          part = item.fixed;
        }
        valueParts.push({
          part,
          beginIndex: valueIndex,
          endIndex: valueIndex + matching - 1
        });
        valueIndex += matching;
      } else {
        valueParts.push({
          part: item.fixed,
          beginIndex: valueIndex,
          endIndex: valueIndex + length - 1
        });
      }

      maskIndex += 1;
      found = true;
    } else if (item.options) {
      // reverse assuming larger is later
      found = item.options
        .slice(0)
        .reverse()
        // eslint-disable-next-line no-loop-func
        .some(option => {
          const { length } = option;
          const part = value.slice(valueIndex, valueIndex + length);
          if (part === option) {
            valueParts.push({
              part,
              beginIndex: valueIndex,
              endIndex: valueIndex + length - 1
            });
            valueIndex += length;
            maskIndex += 1;
            return true;
          }
          return false;
        });
    }
    if (!found) {
      if (item.regexp) {
        const minLength =
          (Array.isArray(item.length) && item.length[0]) || item.length || 1;
        const maxLength =
          (Array.isArray(item.length) && item.length[1]) ||
          item.length ||
          value.length - valueIndex;

        let length = maxLength;
        while (!found && length >= minLength) {
          // make sure that if the regex needs capidatl letters
          // then transform them to upperCase so then is provided an easier UX
          const part =
            item.regexp.includes("A-Z") && !item.regexp.includes("a-z")
              ? value.slice(valueIndex, valueIndex + length).toUpperCase()
              : value.slice(valueIndex, valueIndex + length);

          let reg = new RegExp(item.regexp);

          if (reg.test(part)) {
            valueParts.push({
              part,
              beginIndex: valueIndex,
              endIndex: valueIndex + length - 1
            });
            valueIndex += length;
            maskIndex += 1;
            found = true;
          }
          length -= 1;
        }
        if (!found) {
          valueIndex = value.length;
        }
      } else {
        const length = Array.isArray(item.length)
          ? item.length[1]
          : item.length || value.length - valueIndex;
        const part = value.slice(valueIndex, valueIndex + length);
        valueParts.push({
          part,
          beginIndex: valueIndex,
          endIndex: valueIndex + length - 1
        });
        valueIndex += length;
        maskIndex += 1;
      }
    }
  }
  return valueParts;
};

const version = [
  {
    regexp: "^.*$"
  }
];

const defaultMask = version;

const MaskedInput = forwardRef(
  (
    {
      a11yTitle,
      focus: focusProp,
      icon,
      id,
      mask = defaultMask,
      name,
      onBlur,
      schemaMask,
      onChange,
      onFocus,
      onKeyDown,
      placeholder,
      plain,
      buttons,
      reverse,
      value: valueProp,
      ...rest
    },
    ref
  ) => {
    const formContext = useContext(FormContext);

    const [value, setValue] = formContext.useFormInput(name, valueProp);

    const [valueParts, setValueParts] = useState(parseValue(mask, value));
    useEffect(
      () => {
        setValueParts(parseValue(mask, value));
      },
      [mask, value]
    );

    const inputRef = useForwardedRef(ref);
    const dropRef = useRef();

    const [focus, setFocus] = useState(focusProp);
    const [activeMaskIndex, setActiveMaskIndex] = useState();
    const [activeOptionIndex, setActiveOptionIndex] = useState();
    const [showDrop, setShowDrop] = useState();

    useEffect(
      () => {
        if (focus) {
          const timer = setTimeout(() => {
            // determine which mask element the caret is at
            const caretIndex = inputRef.current.selectionStart;
            let maskIndex;
            valueParts.some((part, index) => {
              if (
                part.beginIndex <= caretIndex &&
                part.endIndex >= caretIndex
              ) {
                maskIndex = index;
                return true;
              }
              return false;
            });
            if (maskIndex === undefined && valueParts.length < mask.length) {
              maskIndex = valueParts.length; // first unused one
            }
            if (maskIndex && mask[maskIndex].fixed) {
              maskIndex -= 1; // fixed mask parts are never "active"
            }
            if (maskIndex !== activeMaskIndex) {
              setActiveMaskIndex(maskIndex);
              setActiveOptionIndex(-1);
              setShowDrop(maskIndex >= 0 && mask[maskIndex].options && true);
            }
          }, 10); // 10ms empirically chosen
          return () => clearTimeout(timer);
        }
        return undefined;
      },
      [activeMaskIndex, focus, inputRef, mask, valueParts]
    );

    const setInputValue = useCallback(
      nextValue => {
        // Calling set value function directly on input because React library
        // overrides setter `event.target.value =` and loses original event
        // target fidelity.
        // https://stackoverflow.com/a/46012210 &&
        // https://github.com/grommet/grommet/pull/3171#discussion_r296415239
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value"
        ).set;
        nativeInputValueSetter.call(inputRef.current, nextValue);
        const event = new Event("input", { bubbles: true });
        inputRef.current.dispatchEvent(event);
      },
      [inputRef]
    );

    // This could be due to a paste or as the user is typing.
    const onChangeInput = useCallback(
      event => {
        // Align with the mask.
        const nextValueParts = parseValue(mask, event.target.value);
        const nextValue = nextValueParts.map(part => part.part).join("");

        if (nextValue !== event.target.value) {
          // The mask required inserting something, change the input.
          // This will re-trigger this callback with the next value
          setInputValue(nextValue);
        } else if (value !== nextValue) {
          setValue(nextValue);
          if (onChange) onChange(event);
        }
      },
      [mask, onChange, setInputValue, setValue, value]
    );

    const onOption = useCallback(
      option => () => {
        const nextValueParts = [...valueParts];
        nextValueParts[activeMaskIndex] = { part: option };
        // add any fixed parts that follow
        let index = activeMaskIndex + 1;
        while (
          index < mask.length &&
          !nextValueParts[index] &&
          mask[index].fixed
        ) {
          nextValueParts[index] = { part: mask[index].fixed };
          index += 1;
        }
        const nextValue = nextValueParts.map(part => part.part).join("");
        setInputValue(nextValue);
        // restore focus to input
        inputRef.current.focus();
      },
      [activeMaskIndex, inputRef, mask, setInputValue, valueParts]
    );

    const onNextOption = useCallback(
      event => {
        const item = mask[activeMaskIndex];
        if (item && item.options) {
          event.preventDefault();
          const index = Math.min(
            activeOptionIndex + 1,
            item.options.length - 1
          );
          setActiveOptionIndex(index);
        }
      },
      [activeMaskIndex, activeOptionIndex, mask]
    );

    const onPreviousOption = useCallback(
      event => {
        if (activeMaskIndex >= 0 && mask[activeMaskIndex].options) {
          event.preventDefault();
          const index = Math.max(activeOptionIndex - 1, 0);
          setActiveOptionIndex(index);
        }
      },
      [activeMaskIndex, activeOptionIndex, mask]
    );

    const onSelectOption = useCallback(
      event => {
        if (activeMaskIndex >= 0 && activeOptionIndex >= 0) {
          event.preventDefault();
          const option = mask[activeMaskIndex].options[activeOptionIndex];
          onOption(option)();
        }
      },
      [activeMaskIndex, activeOptionIndex, mask, onOption]
    );

    const onEsc = useCallback(
      event => {
        if (showDrop) {
          // we have to stop both synthetic events and native events
          // drop and layer should not close by pressing esc on this input
          event.stopPropagation();
          event.nativeEvent.stopImmediatePropagation();
          setShowDrop(false);
        }
      },
      [showDrop]
    );

    const renderPlaceholder = () => {
      return mask.map(item => item.placeholder || item.fixed).join("");
    };

    const status = new RegExp(schemaMask).test(value);
    return (
      <Box>
        <Keyboard
          onEsc={onEsc}
          onTab={showDrop ? () => setShowDrop(false) : undefined}
          onLeft={undefined}
          onRight={undefined}
          onUp={onPreviousOption}
          onDown={showDrop ? onNextOption : () => setShowDrop(true)}
          onEnter={onSelectOption}
          onKeyDown={onKeyDown}
        >
          <Box direction="row" justify="between" align="center">
            <Box className="cap-grommet-input">
              <input
                ref={inputRef}
                aria-label={a11yTitle}
                id={id}
                name={name}
                autoComplete="off"
                plain={plain}
                placeholder={placeholder || renderPlaceholder()}
                icon={icon}
                reverse={reverse}
                focus={focus}
                {...rest}
                value={value}
                onFocus={event => {
                  setFocus(true);
                  setShowDrop(true);
                  if (onFocus) onFocus(event);
                }}
                onBlur={event => {
                  if (!onBlur) return;
                  setFocus(false);
                  // This will be called when the user clicks on a suggestion,
                  // check for that and don't remove the drop in that case.
                  // Drop will already have removed itself if the user has focused
                  // outside of the Drop.
                  if (!dropRef.current) setShowDrop(false);
                  onBlur(event);
                }}
                onChange={onChangeInput}
              />
            </Box>
            <Box>{buttons && buttons(status)}</Box>
          </Box>
        </Keyboard>
      </Box>
    );
  }
);

export default MaskedInput;
