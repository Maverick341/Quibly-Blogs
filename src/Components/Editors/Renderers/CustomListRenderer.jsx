import React from 'react';

const Bullet = ({ children }) => (
  <li className="text-xs sm:text-sm leading-6 sm:leading-7 mb-2 sm:mb-3">
    {children}
  </li>
);

const Group = ({ 
  Tag, 
  items, 
  baseClassName = '', 
  start = 1, 
  counterType = 'numeric',
  isNested = false
}) => {
  // Build Tailwind class names
  let listClasses = 'my-4 sm:my-6 pl-5 sm:pl-6';
  
  if (!isNested) {
    listClasses += ' list-inside';
  }

  // Add list style based on type and counterType
  if (Tag === 'ol') {
    if (counterType === 'lower-roman') {
      listClasses += ' list-roman';
    } else if (counterType === 'upper-roman') {
      listClasses += ' list-roman';
    } else if (counterType === 'lower-alpha') {
      listClasses += ' list-alpha';
    } else if (counterType === 'upper-alpha') {
      listClasses += ' list-alpha';
    } else {
      // numeric (default)
      listClasses += ' list-decimal';
    }
  } else {
    listClasses += ' list-disc';
  }

  // Merge with any provided custom className
  const finalClassName = `${listClasses} ${baseClassName}`.trim();

  const listProps = {
    className: finalClassName,
  };

  // Handle ordered list attributes
  if (Tag === 'ol') {
    if (start && start !== 1) {
      listProps.start = start;
    }
    // Apply counter type styling for roman numerals, etc. using inline styles
    if (counterType && counterType !== 'numeric') {
      const counterTypeMap = {
        'lower-roman': 'lower-roman',
        'upper-roman': 'upper-roman',
        'lower-alpha': 'lower-alpha',
        'upper-alpha': 'upper-alpha',
      };
      const styleType = counterTypeMap[counterType] || counterType;
      listProps.style = { listStyleType: styleType };
    }
  }

  return (
    <Tag {...listProps}>
      {items.map((item, i) => (
        <Bullet key={i}>
          {typeof item === 'string' ? (
            <span dangerouslySetInnerHTML={{ __html: item }} />
          ) : (
            <>
              <span dangerouslySetInnerHTML={{ __html: item?.content }} />
              {item?.items?.length > 0 && (
                <Group 
                  Tag={Tag} 
                  items={item.items} 
                  baseClassName={baseClassName}
                  start={start}
                  counterType={counterType}
                  isNested={true}
                />
              )}
            </>
          )}
        </Bullet>
      ))}
    </Tag>
  );
};

const CustomListRenderer = ({ data, className = '' }) => {
  if (!data) return null;

  const { style = 'unordered', items = [], meta = {} } = data;
  const { start = 1, counterType = 'numeric' } = meta;

  const Tag = style === 'ordered' ? 'ol' : 'ul';
  
  return (
    <Group 
      Tag={Tag} 
      items={items} 
      baseClassName={className}
      start={start}
      counterType={counterType}
      isNested={false}
    />
  );
};

export default CustomListRenderer;
