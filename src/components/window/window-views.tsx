interface WindowItem {
  id: string;
  name: string;
  icon?: string;
  type: string;
  size?: string;
  modified?: string;
}

interface ViewProps {
  items: WindowItem[];
}

export function IconView({ items }: ViewProps) {
  return (
    <div className="icon-view">
      {items.map((item) => (
        <div key={item.id} className="icon-item">
          <div className="icon-wrapper">
            {item.icon ? (
              <img src={item.icon} alt={item.name} className="icon" />
            ) : (
              <div className="default-icon">{item.type[0]}</div>
            )}
          </div>
          <span className="icon-label">{item.name}</span>
        </div>
      ))}
    </div>
  );
}

export function ListView({ items }: ViewProps) {
  return (
    <div className="list-view">
      <div className="list-header">
        <div className="name-col">Name</div>
        <div className="type-col">Type</div>
        <div className="size-col">Size</div>
        <div className="modified-col">Modified</div>
      </div>
      {items.map((item) => (
        <div key={item.id} className="list-item">
          <div className="name-col">
            <span className="icon-small">
              {item.icon ? (
                <img src={item.icon} alt="" />
              ) : (
                <span className="default-icon-small">{item.type[0]}</span>
              )}
            </span>
            {item.name}
          </div>
          <div className="type-col">{item.type}</div>
          <div className="size-col">{item.size}</div>
          <div className="modified-col">{item.modified}</div>
        </div>
      ))}
    </div>
  );
}
