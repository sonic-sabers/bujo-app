"use client";

import { memo, useMemo, useState } from "react";
import { eventRegistry } from "./eventRegistry";

export type JsonNode =
  | {
      type: "text";
      props?: { className?: string };
      children?: string;
    }
  | {
      type: "container";
      props?: { className?: string };
      children?: JsonNode[];
    }
  | {
      type: "card";
      props?: {
        className?: string;
        title?: string;
        description?: string;
        variant?: "default" | "elevated" | "outlined" | "gradient";
      };
      children?: JsonNode[];
    }
  | {
      type: "chatBubble";
      props?: {
        className?: string;
        role: "user" | "assistant" | "system";
        text: string;
        timestamp?: string;
        variant?: "default" | "gradient";
      };
    }
  | {
      type: "button";
      props?: {
        className?: string;
        ariaLabel?: string;
        label?: string;
        variant?: "default" | "secondary";
      };
      events?: { onClick?: string };
      eventPayload?: unknown;
    }
  | {
      type: "input";
      props?: {
        className?: string;
        name: string;
        placeholder?: string;
        type?: string;
        label?: string;
        required?: boolean;
        defaultValue?: string;
      };
    }
  | {
      type: "select";
      props?: {
        className?: string;
        name: string;
        label?: string;
        required?: boolean;
        defaultValue?: string;
        options: Array<{ label: string; value: string }>;
      };
    }
  | {
      type: "checkbox";
      props?: {
        className?: string;
        name: string;
        label: string;
        defaultChecked?: boolean;
      };
    }
  | {
      type: "form";
      props?: {
        className?: string;
        title?: string;
        description?: string;
      };
      children?: JsonNode[];
      events?: { onSubmit?: string; onReset?: string };
    }
  | {
      type: "divider";
      props?: { className?: string };
    };

function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

export const JsonRenderer = memo(function JsonRenderer({
  node,
}: {
  node: JsonNode;
}) {
  const [localLikes, setLocalLikes] = useState<Record<string, number>>({});

  const renderNode = (
    n: JsonNode,
    key?: string | number
  ): React.ReactElement | null => {
    switch (n.type) {
      case "text":
        return (
          <p
            key={key}
            className={cx("text-sm text-gray-700", n.props?.className)}
          >
            {n.children ?? ""}
          </p>
        );

      case "divider":
        return (
          <div
            key={key}
            className={cx("h-px bg-gray-200 my-3", n.props?.className)}
          />
        );

      case "container":
        return (
          <div key={key} className={cx("w-full", n.props?.className)}>
            {n.children?.map((child, idx) => renderNode(child, idx))}
          </div>
        );

      case "card": {
        const variant = n.props?.variant ?? "default";
        const base = "rounded-xl p-4";
        const styles =
          variant === "elevated"
            ? "bg-white shadow-md border border-gray-100"
            : variant === "outlined"
            ? "bg-white border border-gray-200"
            : variant === "gradient"
            ? "text-white bg-gradient-to-br from-blue-600 to-cyan-500"
            : "bg-white shadow-sm border border-gray-200";

        return (
          <div key={key} className={cx(base, styles, n.props?.className)}>
            {n.props?.title && (
              <div
                className={cx(
                  "text-sm font-semibold",
                  variant === "gradient" ? "text-white" : "text-gray-900"
                )}
              >
                {n.props.title}
              </div>
            )}
            {n.props?.description && (
              <div
                className={cx(
                  "text-xs mt-1",
                  variant === "gradient" ? "text-white/90" : "text-gray-600"
                )}
              >
                {n.props.description}
              </div>
            )}
            {n.children?.length ? (
              <div
                className={cx(
                  "mt-3",
                  variant === "gradient" ? "text-white" : "text-gray-900"
                )}
              >
                {n.children.map((child, idx) => renderNode(child, idx))}
              </div>
            ) : null}
          </div>
        );
      }

      case "chatBubble": {
        const role = n.props?.role;
        const variant = n.props?.variant ?? "default";
        const isUser = role === "user";

        const bubbleBase = "max-w-[85%] rounded-2xl px-4 py-2 text-sm";
        const bubbleStyles = isUser
          ? variant === "gradient"
            ? "text-white bg-gradient-to-r from-blue-600 to-cyan-500 rounded-br-sm"
            : "text-white bg-blue-600 rounded-br-sm"
          : role === "system"
          ? "text-gray-700 bg-gray-100 border border-gray-200"
          : variant === "gradient"
          ? "text-white bg-gradient-to-r from-slate-700 to-slate-900 rounded-bl-sm"
          : "text-gray-800 bg-white rounded-bl-sm border border-gray-200 shadow-sm";

        return (
          <div
            key={key}
            className={cx(
              "flex",
              isUser ? "justify-end" : "justify-start",
              n.props?.className
            )}
          >
            <div className={cx(bubbleBase, bubbleStyles)}>
              <div className="whitespace-pre-wrap leading-relaxed">
                {n.props?.text}
              </div>
              {n.props?.timestamp ? (
                <div
                  className={cx(
                    "mt-1 text-[10px]",
                    isUser ? "text-white/80" : "text-gray-500"
                  )}
                >
                  {n.props.timestamp}
                </div>
              ) : null}
            </div>
          </div>
        );
      }

      case "button": {
        const onClickKey = n.events?.onClick;
        const onClick = onClickKey ? eventRegistry[onClickKey] : undefined;

        const isSecondary = n.props?.variant === "secondary";
        const base =
          "inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors";
        const styles = isSecondary
          ? "bg-gray-100 text-gray-900 hover:bg-gray-200"
          : "bg-blue-600 text-white hover:bg-blue-700";

        return (
          <button
            key={key}
            type="button"
            aria-label={n.props?.ariaLabel}
            className={cx(base, styles, n.props?.className)}
            onClick={() => {
              if (onClick) onClick(n.eventPayload);
            }}
          >
            {n.props?.label ?? "Button"}
          </button>
        );
      }

      case "input":
        return (
          <label key={key} className={cx("block", n.props?.className)}>
            {n.props?.label && (
              <span className="block text-xs font-medium text-gray-700 mb-1">
                {n.props.label}
              </span>
            )}
            <input
              name={n.props?.name}
              type={n.props?.type ?? "text"}
              required={n.props?.required}
              defaultValue={n.props?.defaultValue}
              placeholder={n.props?.placeholder}
              className={
                "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              }
            />
          </label>
        );

      case "select":
        return (
          <label key={key} className={cx("block", n.props?.className)}>
            {n.props?.label && (
              <span className="block text-xs font-medium text-gray-700 mb-1">
                {n.props.label}
              </span>
            )}
            <select
              name={n.props?.name}
              required={n.props?.required}
              defaultValue={n.props?.defaultValue}
              className={
                "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              }
            >
              {n.props?.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
        );

      case "checkbox":
        return (
          <label
            key={key}
            className={cx("flex items-center gap-2", n.props?.className)}
          >
            <input
              name={n.props?.name}
              type="checkbox"
              defaultChecked={n.props?.defaultChecked}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{n.props?.label}</span>
          </label>
        );

      case "form": {
        const onSubmitKey = n.events?.onSubmit;
        const onResetKey = n.events?.onReset;
        const onSubmit = onSubmitKey ? eventRegistry[onSubmitKey] : undefined;
        const onReset = onResetKey ? eventRegistry[onResetKey] : undefined;

        return (
          <form
            key={key}
            className={cx(
              "w-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm",
              n.props?.className
            )}
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const data = new FormData(form);
              const payload: Record<string, string | boolean> = {};

              for (const [k, v] of data.entries()) {
                payload[k] = String(v);
              }

              const checkboxes = Array.from(
                form.querySelectorAll("input[type='checkbox']")
              );
              for (const el of checkboxes) {
                const input = el as HTMLInputElement;
                if (input.name) payload[input.name] = input.checked;
              }

              onSubmit?.(payload);
            }}
            onReset={() => {
              onReset?.();
            }}
          >
            {n.props?.title && (
              <h4 className="text-sm font-semibold text-gray-900">
                {n.props.title}
              </h4>
            )}
            {n.props?.description && (
              <p className="text-xs text-gray-600 mt-1">
                {n.props.description}
              </p>
            )}

            <div className="mt-3 space-y-3">
              {n.children?.map((child, idx) => {
                if (
                  child.type === "button" &&
                  child.events?.onClick === "likeDemo"
                ) {
                  const likeKey = String(idx);
                  const current = localLikes[likeKey] ?? 0;
                  return (
                    <button
                      key={idx}
                      type="button"
                      className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 hover:bg-gray-50"
                      onClick={() => {
                        const next = current + 1;
                        setLocalLikes((prev) => ({ ...prev, [likeKey]: next }));
                        const onClick = eventRegistry.likeDemo;
                        onClick?.({ count: next });
                      }}
                    >
                      <span>{"❤️"}</span>
                      <span>{current}</span>
                    </button>
                  );
                }

                return renderNode(child, idx);
              })}
            </div>

            <div className="mt-4 flex items-center gap-2">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Submit
              </button>
              <button
                type="reset"
                className="inline-flex items-center justify-center rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200"
              >
                Reset
              </button>
            </div>
          </form>
        );
      }

      default:
        return null;
    }
  };

  const element = useMemo(() => renderNode(node), [node]);
  return element;
});
