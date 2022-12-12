import { JSX } from "solid-js";

export type IconProps = { title: string } & JSX.HTMLAttributes<SVGSVGElement>;

// https://icons.getbootstrap.com/
export function ListUlIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 16 16"
      {...props}
    >
      <title>{props.title}</title>
      <path
        fill-rule="evenodd"
        d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
      />
    </svg>
  );
}

// https://icons.getbootstrap.com/
export function ControllerIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 16 16"
      {...props}
    >
      <title>{props.title}</title>
      <path d="M11.5 6.027a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm-1.5 1.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm2.5-.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm-1.5 1.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm-6.5-3h1v1h1v1h-1v1h-1v-1h-1v-1h1v-1z" />
      <path d="M3.051 3.26a.5.5 0 0 1 .354-.613l1.932-.518a.5.5 0 0 1 .62.39c.655-.079 1.35-.117 2.043-.117.72 0 1.443.041 2.12.126a.5.5 0 0 1 .622-.399l1.932.518a.5.5 0 0 1 .306.729c.14.09.266.19.373.297.408.408.78 1.05 1.095 1.772.32.733.599 1.591.805 2.466.206.875.34 1.78.364 2.606.024.816-.059 1.602-.328 2.21a1.42 1.42 0 0 1-1.445.83c-.636-.067-1.115-.394-1.513-.773-.245-.232-.496-.526-.739-.808-.126-.148-.25-.292-.368-.423-.728-.804-1.597-1.527-3.224-1.527-1.627 0-2.496.723-3.224 1.527-.119.131-.242.275-.368.423-.243.282-.494.575-.739.808-.398.38-.877.706-1.513.773a1.42 1.42 0 0 1-1.445-.83c-.27-.608-.352-1.395-.329-2.21.024-.826.16-1.73.365-2.606.206-.875.486-1.733.805-2.466.315-.722.687-1.364 1.094-1.772a2.34 2.34 0 0 1 .433-.335.504.504 0 0 1-.028-.079zm2.036.412c-.877.185-1.469.443-1.733.708-.276.276-.587.783-.885 1.465a13.748 13.748 0 0 0-.748 2.295 12.351 12.351 0 0 0-.339 2.406c-.022.755.062 1.368.243 1.776a.42.42 0 0 0 .426.24c.327-.034.61-.199.929-.502.212-.202.4-.423.615-.674.133-.156.276-.323.44-.504C4.861 9.969 5.978 9.027 8 9.027s3.139.942 3.965 1.855c.164.181.307.348.44.504.214.251.403.472.615.674.318.303.601.468.929.503a.42.42 0 0 0 .426-.241c.18-.408.265-1.02.243-1.776a12.354 12.354 0 0 0-.339-2.406 13.753 13.753 0 0 0-.748-2.295c-.298-.682-.61-1.19-.885-1.465-.264-.265-.856-.523-1.733-.708-.85-.179-1.877-.27-2.913-.27-1.036 0-2.063.091-2.913.27z" />
    </svg>
  );
}

// https://icons.getbootstrap.com
export function AddFolderIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 16 16"
      {...props}
    >
      <title>{props.title}</title>
      <path d="m.5 3 .04.87a1.99 1.99 0 0 0-.342 1.311l.637 7A2 2 0 0 0 2.826 14H9v-1H2.826a1 1 0 0 1-.995-.91l-.637-7A1 1 0 0 1 2.19 4h11.62a1 1 0 0 1 .996 1.09L14.54 8h1.005l.256-2.819A2 2 0 0 0 13.81 3H9.828a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 6.172 1H2.5a2 2 0 0 0-2 2zm5.672-1a1 1 0 0 1 .707.293L7.586 3H2.19c-.24 0-.47.042-.683.12L1.5 2.98a1 1 0 0 1 1-.98h3.672z" />
      <path d="M13.5 10a.5.5 0 0 1 .5.5V12h1.5a.5.5 0 1 1 0 1H14v1.5a.5.5 0 1 1-1 0V13h-1.5a.5.5 0 0 1 0-1H13v-1.5a.5.5 0 0 1 .5-.5z" />
    </svg>
  );
}

// https://heroicons.com
export function FilmIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width={1.5}
      stroke="currentColor"
      {...props}
    >
      <title>{props.title}</title>
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0118 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0118 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 016 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25C6 11.496 5.496 12 4.875 12M18 10.875c0 .621-.504 1.125-1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621-.504-1.125-1.125-1.125M18 18.375v-5.25m0 5.25v-1.5c0-.621.504-1.125 1.125-1.125M18 13.125v1.5c0 .621.504 1.125 1.125 1.125M18 13.125c0-.621.504-1.125 1.125-1.125M6 13.125v1.5c0 .621-.504 1.125-1.125 1.125M6 13.125C6 12.504 5.496 12 4.875 12m-1.5 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M19.125 12h1.5m0 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h1.5m14.25 0h1.5"
      />
    </svg>
  );
}

// https://phosphoricons.com/
export function FilmSlateIcon(props: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" {...props}>
      <title>{props.title}</title>
      <path
        d="M210,66.4l-8.3-30.9a7.9,7.9,0,0,0-9.8-5.6L130.1,46.4l49,28.3Z"
        fill="currentColor"
        opacity="0.2"
      ></path>
      <path
        d="M109.5,93.4,60.6,65.1,37.4,71.3a8,8,0,0,0-5.7,9.8L40,112Z"
        fill="currentColor"
        opacity="0.2"
      ></path>
      <path
        d="M40,112H216a0,0,0,0,1,0,0v88a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V112A0,0,0,0,1,40,112Z"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="16"
      ></path>
      <path
        d="M40,112,210,66.4l-8.3-30.9a7.9,7.9,0,0,0-9.8-5.6L37.4,71.3a8,8,0,0,0-5.7,9.8Z"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="16"
      ></path>
      <line
        x1="130.1"
        y1="46.4"
        x2="179.1"
        y2="74.7"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="16"
      ></line>
      <line
        x1="60.6"
        y1="65.1"
        x2="109.5"
        y2="93.4"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="16"
      ></line>
    </svg>
  );
}

// https://heroicons.com
export function Cog6ToothIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width={1.5}
      stroke="currentColor"
      {...props}
    >
      <title>{props.title}</title>
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
      />
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

// https://heroicons.com
export function GitHubIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="currentColor"
      stroke="none"
      {...props}
    >
      <title>{props.title}</title>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M12 2C6.477 2 2 6.463 2 11.97c0 4.404 2.865 8.14 6.839 9.458.5.092.682-.216.682-.48 0-.236-.008-.864-.013-1.695-2.782.602-3.369-1.337-3.369-1.337-.454-1.151-1.11-1.458-1.11-1.458-.908-.618.069-.606.069-.606 1.003.07 1.531 1.027 1.531 1.027.892 1.524 2.341 1.084 2.91.828.092-.643.35-1.083.636-1.332-2.22-.251-4.555-1.107-4.555-4.927 0-1.088.39-1.979 1.029-2.675-.103-.252-.446-1.266.098-2.638 0 0 .84-.268 2.75 1.022A9.607 9.607 0 0 1 12 6.82c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.022 2.747-1.022.546 1.372.202 2.386.1 2.638.64.696 1.028 1.587 1.028 2.675 0 3.83-2.339 4.673-4.566 4.92.359.307.678.915.678 1.846 0 1.332-.012 2.407-.012 2.734 0 .267.18.577.688.48 3.97-1.32 6.833-5.054 6.833-9.458C22 6.463 17.522 2 12 2Z"
      ></path>
    </svg>
  );
}

// https://heroicons.com
export function CloudIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width={1.5}
      stroke="currentColor"
      {...props}
    >
      <title>{props.title}</title>
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z"
      />
    </svg>
  );
}

// https://heroicons.com
export function TwitterIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      aria-hidden="true"
      fill="#1DA1F2"
      {...props}
    >
      <title>{props.title}</title>
      <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0 0 20 3.92a8.19 8.19 0 0 1-2.357.646 4.118 4.118 0 0 0 1.804-2.27 8.224 8.224 0 0 1-2.605.996 4.107 4.107 0 0 0-6.993 3.743 11.65 11.65 0 0 1-8.457-4.287 4.106 4.106 0 0 0 1.27 5.477A4.073 4.073 0 0 1 .8 7.713v.052a4.105 4.105 0 0 0 3.292 4.022 4.095 4.095 0 0 1-1.853.07 4.108 4.108 0 0 0 3.834 2.85A8.233 8.233 0 0 1 0 16.407a11.615 11.615 0 0 0 6.29 1.84"></path>
    </svg>
  );
}

export function VideoLibraryIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="currentColor"
      {...props}
    >
      <title>{props.title}</title>
      <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12zM12 5.5v9l6-4.5z" />
    </svg>
  );
}

export function ArrowLeft(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="4 4 8 8"
      {...props}
    >
      <title>{props.title}</title>
      <path
        fill-rule="evenodd"
        d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z"
      />
    </svg>
  );
}

export function ArrowRight(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="4 4 8 8"
      {...props}
    >
      <title>{props.title}</title>
      <path
        fill-rule="evenodd"
        d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"
      />
    </svg>
  );
}

// https://heroicons.com
export function ShareIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width={1.5}
      stroke="currentColor"
      {...props}
    >
      <title>{props.title}</title>
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
      />
    </svg>
  );
}

export function DownloadIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width={1.5}
      stroke="currentColor"
      {...props}
    >
      <title>{props.title}</title>
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
      />
    </svg>
  );
}

// https://heroicons.com
export function PlusIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width={1.5}
      stroke="currentColor"
      {...props}
    >
      <title>{props.title}</title>
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </svg>
  );
}

// https://heroicons.com
export function MinusIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width={1.5}
      stroke="currentColor"
      {...props}
    >
      <title>{props.title}</title>
      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15" />
    </svg>
  );
}

// https://icons.getbootstrap.com
export function KeyboardIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 16 16"
      {...props}
    >
      <title>{props.title}</title>
      <path d="M14 5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h12zM2 4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H2z" />
      <path d="M13 10.25a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5zm0-2a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5zm-5 0A.25.25 0 0 1 8.25 8h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 8 8.75v-.5zm2 0a.25.25 0 0 1 .25-.25h1.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-1.5a.25.25 0 0 1-.25-.25v-.5zm1 2a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5zm-5-2A.25.25 0 0 1 6.25 8h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 6 8.75v-.5zm-2 0A.25.25 0 0 1 4.25 8h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 4 8.75v-.5zm-2 0A.25.25 0 0 1 2.25 8h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 2 8.75v-.5zm11-2a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5zm-2 0a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5zm-2 0A.25.25 0 0 1 9.25 6h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 9 6.75v-.5zm-2 0A.25.25 0 0 1 7.25 6h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 7 6.75v-.5zm-2 0A.25.25 0 0 1 5.25 6h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 5 6.75v-.5zm-3 0A.25.25 0 0 1 2.25 6h1.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-1.5A.25.25 0 0 1 2 6.75v-.5zm0 4a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5zm2 0a.25.25 0 0 1 .25-.25h5.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-5.5a.25.25 0 0 1-.25-.25v-.5z" />
    </svg>
  );
}

// Comfortaa from Google Fonts
export function SlippiLab(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 311.513 61.44"
      {...props}
    >
      <title>{props.title}</title>
      <path d="M 17.453 48 Q 20.693 48 23.723 47.16 A 19.035 19.035 0 0 0 24.47 46.937 A 16.564 16.564 0 0 0 29.123 44.61 Q 31.493 42.9 32.903 40.38 A 10.672 10.672 0 0 0 34.004 37.443 A 13.96 13.96 0 0 0 34.313 34.44 A 16.55 16.55 0 0 0 34.258 33.08 A 12.014 12.014 0 0 0 30.323 24.87 Q 27.751 22.53 23.871 21.4 A 26.073 26.073 0 0 0 19.193 20.52 A 45.538 45.538 0 0 1 18.728 20.47 Q 15.887 20.149 13.893 19.55 A 12.798 12.798 0 0 1 12.023 18.84 Q 10.612 18.16 9.702 17.336 A 5.412 5.412 0 0 1 8.603 15.99 Q 7.673 14.34 7.673 12.54 A 7.72 7.72 0 0 1 7.706 11.818 Q 7.987 8.821 10.673 7.29 A 10.766 10.766 0 0 1 11.222 6.998 Q 13.965 5.638 17.813 5.638 A 22.154 22.154 0 0 1 18.113 5.64 A 17.961 17.961 0 0 1 18.425 5.643 Q 20.749 5.683 22.493 6.33 A 11.826 11.826 0 0 1 23.062 6.558 A 10.179 10.179 0 0 1 25.733 8.22 A 9.924 9.924 0 0 1 26.476 8.938 A 11.085 11.085 0 0 1 28.073 11.16 Q 28.733 12.3 30.053 12.72 Q 30.852 12.974 31.585 12.811 A 2.924 2.924 0 0 0 32.513 12.42 A 3.134 3.134 0 0 0 32.674 12.308 A 2.442 2.442 0 0 0 33.683 10.59 A 2.812 2.812 0 0 0 33.705 10.232 Q 33.705 9.22 32.993 8.1 A 20.537 20.537 0 0 0 32.892 7.938 A 18.366 18.366 0 0 0 29.453 3.84 A 14.261 14.261 0 0 0 28.527 3.09 A 15.477 15.477 0 0 0 24.683 1.02 A 13.515 13.515 0 0 0 24.294 0.882 Q 22.918 0.415 21.317 0.195 A 22.273 22.273 0 0 0 18.293 0 Q 13.613 0 9.803 1.44 A 16.654 16.654 0 0 0 7.733 2.383 A 12.94 12.94 0 0 0 3.773 5.64 A 9.708 9.708 0 0 0 2.039 8.915 A 11.726 11.726 0 0 0 1.553 12.36 Q 1.553 17.76 5.813 21.42 A 15.211 15.211 0 0 0 7.658 22.775 Q 9.81 24.123 12.576 24.903 A 28.185 28.185 0 0 0 17.513 25.8 A 29.07 29.07 0 0 1 17.618 25.811 Q 23.236 26.423 25.703 28.92 A 10.351 10.351 0 0 1 26.42 29.724 A 7.649 7.649 0 0 1 28.193 34.62 A 7.903 7.903 0 0 1 28.16 35.35 A 6.005 6.005 0 0 1 26.693 38.85 A 8.647 8.647 0 0 1 25.052 40.296 A 10.557 10.557 0 0 1 22.763 41.46 A 13.871 13.871 0 0 1 20.877 42.009 A 16.153 16.153 0 0 1 17.453 42.36 Q 14.873 42.36 12.533 41.58 A 15.983 15.983 0 0 1 10.729 40.86 A 12.239 12.239 0 0 1 8.543 39.54 A 11.277 11.277 0 0 1 8.45 39.469 Q 7.76 38.93 7.238 38.349 A 6.68 6.68 0 0 1 6.173 36.78 A 4.488 4.488 0 0 0 6.151 36.736 A 3.664 3.664 0 0 0 4.583 35.07 A 3.678 3.678 0 0 0 4.259 34.914 Q 3.679 34.669 3.09 34.669 A 2.931 2.931 0 0 0 2.453 34.74 A 4.076 4.076 0 0 0 1.6 35.004 A 2.693 2.693 0 0 0 0.323 36.12 A 2.664 2.664 0 0 0 0.284 36.189 Q -0.288 37.24 0.293 38.46 A 12.334 12.334 0 0 0 1.414 40.522 A 14.03 14.03 0 0 0 4.073 43.44 A 17.526 17.526 0 0 0 5.774 44.697 A 19.807 19.807 0 0 0 10.133 46.8 Q 13.613 48 17.453 48 Z" />
      <path d="M 51.173 47.4 L 51.053 47.4 A 8.206 8.206 0 0 1 47.916 46.809 A 7.773 7.773 0 0 1 46.373 45.96 A 9.322 9.322 0 0 1 43.573 42.787 A 11.387 11.387 0 0 1 43.193 42.03 A 12.383 12.383 0 0 1 42.216 38.648 A 16.231 16.231 0 0 1 42.053 36.3 L 42.053 3.54 A 3.386 3.386 0 0 1 42.202 2.512 A 2.759 2.759 0 0 1 42.893 1.38 Q 43.733 0.54 45.053 0.54 A 3.386 3.386 0 0 1 46.081 0.69 A 2.759 2.759 0 0 1 47.213 1.38 Q 48.053 2.22 48.053 3.54 L 48.053 36.3 Q 48.053 38.108 48.61 39.399 A 5.213 5.213 0 0 0 48.893 39.96 Q 49.478 40.964 50.296 41.268 A 2.153 2.153 0 0 0 51.053 41.4 L 52.553 41.4 A 2.783 2.783 0 0 1 53.516 41.561 A 2.429 2.429 0 0 1 54.503 42.24 A 2.907 2.907 0 0 1 55.198 43.723 A 4.04 4.04 0 0 1 55.253 44.4 A 2.511 2.511 0 0 1 54.395 46.329 A 3.463 3.463 0 0 1 54.113 46.56 A 4.127 4.127 0 0 1 52.621 47.239 Q 51.96 47.4 51.173 47.4 Z" />
      <path d="M 61.853 44.34 L 61.853 17.64 A 3.556 3.556 0 0 1 61.985 16.644 A 2.733 2.733 0 0 1 62.723 15.42 A 2.963 2.963 0 0 1 64.629 14.59 A 3.929 3.929 0 0 1 64.913 14.58 A 3.678 3.678 0 0 1 65.904 14.707 A 2.754 2.754 0 0 1 67.133 15.42 A 2.821 2.821 0 0 1 67.926 17.022 A 3.975 3.975 0 0 1 67.973 17.64 L 67.973 44.34 A 3.405 3.405 0 0 1 67.803 45.435 A 2.892 2.892 0 0 1 67.133 46.53 A 2.806 2.806 0 0 1 65.431 47.367 A 3.922 3.922 0 0 1 64.913 47.4 A 3.284 3.284 0 0 1 63.791 47.215 A 2.878 2.878 0 0 1 62.723 46.53 A 2.936 2.936 0 0 1 61.856 44.503 A 3.882 3.882 0 0 1 61.853 44.34 Z M 62.159 8.106 A 4.75 4.75 0 0 1 62.123 8.07 A 3.941 3.941 0 0 1 61.177 6.612 A 3.904 3.904 0 0 1 60.953 5.28 A 3.802 3.802 0 0 1 62.086 2.527 A 4.75 4.75 0 0 1 62.123 2.49 A 3.941 3.941 0 0 1 63.581 1.544 A 3.904 3.904 0 0 1 64.913 1.32 A 3.802 3.802 0 0 1 67.666 2.454 A 4.75 4.75 0 0 1 67.703 2.49 A 3.941 3.941 0 0 1 68.649 3.949 A 3.904 3.904 0 0 1 68.873 5.28 A 3.802 3.802 0 0 1 67.739 8.033 A 4.75 4.75 0 0 1 67.703 8.07 A 3.941 3.941 0 0 1 66.244 9.016 A 3.904 3.904 0 0 1 64.913 9.24 A 3.802 3.802 0 0 1 62.159 8.106 Z" />
      <path d="M 79.373 58.38 L 79.373 31.02 A 18.299 18.299 0 0 1 80.247 25.535 A 16.329 16.329 0 0 1 81.593 22.5 Q 83.753 18.72 87.473 16.53 A 15.949 15.949 0 0 1 94.718 14.374 A 19.272 19.272 0 0 1 95.873 14.34 A 17.528 17.528 0 0 1 101.012 15.072 A 15.349 15.349 0 0 1 104.333 16.53 Q 108.053 18.72 110.243 22.5 A 16.379 16.379 0 0 1 112.398 29.85 A 19.778 19.778 0 0 1 112.433 31.02 A 19.168 19.168 0 0 1 111.797 36.039 A 16.351 16.351 0 0 1 110.423 39.51 Q 108.413 43.26 104.933 45.45 A 14.33 14.33 0 0 1 97.617 47.632 A 17.192 17.192 0 0 1 97.073 47.64 A 14.849 14.849 0 0 1 92.132 46.83 A 13.849 13.849 0 0 1 90.563 46.17 Q 87.593 44.7 85.493 42.18 L 85.493 58.38 A 3.405 3.405 0 0 1 85.323 59.475 A 2.892 2.892 0 0 1 84.653 60.57 A 2.806 2.806 0 0 1 82.951 61.407 A 3.922 3.922 0 0 1 82.433 61.44 A 3.284 3.284 0 0 1 81.311 61.255 A 2.878 2.878 0 0 1 80.243 60.57 A 2.936 2.936 0 0 1 79.376 58.543 A 3.882 3.882 0 0 1 79.373 58.38 Z M 95.873 42.24 A 10.875 10.875 0 0 0 99.274 41.722 A 9.707 9.707 0 0 0 101.333 40.77 Q 103.733 39.3 105.143 36.75 A 11.369 11.369 0 0 0 106.518 31.999 A 13.717 13.717 0 0 0 106.553 31.02 A 12.74 12.74 0 0 0 106.107 27.593 A 10.903 10.903 0 0 0 105.143 25.23 Q 103.733 22.68 101.333 21.21 A 10.048 10.048 0 0 0 96.627 19.763 A 12.251 12.251 0 0 0 95.873 19.74 A 10.516 10.516 0 0 0 91.774 20.533 A 10.091 10.091 0 0 0 90.443 21.21 Q 88.013 22.68 86.633 25.23 Q 85.253 27.78 85.253 31.02 A 12.622 12.622 0 0 0 85.739 34.574 A 11.089 11.089 0 0 0 86.633 36.75 Q 88.013 39.3 90.443 40.77 A 10.248 10.248 0 0 0 95.686 42.239 A 12.137 12.137 0 0 0 95.873 42.24 Z" />
      <path d="M 121.553 58.38 L 121.553 31.02 A 18.299 18.299 0 0 1 122.427 25.535 A 16.329 16.329 0 0 1 123.773 22.5 Q 125.933 18.72 129.653 16.53 A 15.949 15.949 0 0 1 136.898 14.374 A 19.272 19.272 0 0 1 138.053 14.34 A 17.528 17.528 0 0 1 143.192 15.072 A 15.349 15.349 0 0 1 146.513 16.53 Q 150.233 18.72 152.423 22.5 A 16.379 16.379 0 0 1 154.578 29.85 A 19.778 19.778 0 0 1 154.613 31.02 A 19.168 19.168 0 0 1 153.977 36.039 A 16.351 16.351 0 0 1 152.603 39.51 Q 150.593 43.26 147.113 45.45 A 14.33 14.33 0 0 1 139.797 47.632 A 17.192 17.192 0 0 1 139.253 47.64 A 14.849 14.849 0 0 1 134.312 46.83 A 13.849 13.849 0 0 1 132.743 46.17 Q 129.773 44.7 127.673 42.18 L 127.673 58.38 A 3.405 3.405 0 0 1 127.503 59.475 A 2.892 2.892 0 0 1 126.833 60.57 A 2.806 2.806 0 0 1 125.131 61.407 A 3.922 3.922 0 0 1 124.613 61.44 A 3.284 3.284 0 0 1 123.491 61.255 A 2.878 2.878 0 0 1 122.423 60.57 A 2.936 2.936 0 0 1 121.556 58.543 A 3.882 3.882 0 0 1 121.553 58.38 Z M 138.053 42.24 A 10.875 10.875 0 0 0 141.454 41.722 A 9.707 9.707 0 0 0 143.513 40.77 Q 145.913 39.3 147.323 36.75 A 11.369 11.369 0 0 0 148.698 31.999 A 13.717 13.717 0 0 0 148.733 31.02 A 12.74 12.74 0 0 0 148.287 27.593 A 10.903 10.903 0 0 0 147.323 25.23 Q 145.913 22.68 143.513 21.21 A 10.048 10.048 0 0 0 138.807 19.763 A 12.251 12.251 0 0 0 138.053 19.74 A 10.516 10.516 0 0 0 133.954 20.533 A 10.091 10.091 0 0 0 132.623 21.21 Q 130.193 22.68 128.813 25.23 Q 127.433 27.78 127.433 31.02 A 12.622 12.622 0 0 0 127.919 34.574 A 11.089 11.089 0 0 0 128.813 36.75 Q 130.193 39.3 132.623 40.77 A 10.248 10.248 0 0 0 137.866 42.239 A 12.137 12.137 0 0 0 138.053 42.24 Z" />
      <path d="M 164.333 44.34 L 164.333 17.64 A 3.556 3.556 0 0 1 164.465 16.644 A 2.733 2.733 0 0 1 165.203 15.42 A 2.963 2.963 0 0 1 167.109 14.59 A 3.929 3.929 0 0 1 167.393 14.58 A 3.678 3.678 0 0 1 168.384 14.707 A 2.754 2.754 0 0 1 169.613 15.42 A 2.821 2.821 0 0 1 170.406 17.022 A 3.975 3.975 0 0 1 170.453 17.64 L 170.453 44.34 A 3.405 3.405 0 0 1 170.283 45.435 A 2.892 2.892 0 0 1 169.613 46.53 A 2.806 2.806 0 0 1 167.911 47.367 A 3.922 3.922 0 0 1 167.393 47.4 A 3.284 3.284 0 0 1 166.271 47.215 A 2.878 2.878 0 0 1 165.203 46.53 A 2.936 2.936 0 0 1 164.336 44.503 A 3.882 3.882 0 0 1 164.333 44.34 Z M 164.639 8.106 A 4.75 4.75 0 0 1 164.603 8.07 A 3.941 3.941 0 0 1 163.657 6.612 A 3.904 3.904 0 0 1 163.433 5.28 A 3.802 3.802 0 0 1 164.566 2.527 A 4.75 4.75 0 0 1 164.603 2.49 A 3.941 3.941 0 0 1 166.061 1.544 A 3.904 3.904 0 0 1 167.393 1.32 A 3.802 3.802 0 0 1 170.146 2.454 A 4.75 4.75 0 0 1 170.183 2.49 A 3.941 3.941 0 0 1 171.129 3.949 A 3.904 3.904 0 0 1 171.353 5.28 A 3.802 3.802 0 0 1 170.219 8.033 A 4.75 4.75 0 0 1 170.183 8.07 A 3.941 3.941 0 0 1 168.724 9.016 A 3.904 3.904 0 0 1 167.393 9.24 A 3.802 3.802 0 0 1 164.639 8.106 Z" />
      <path d="M 227.933 47.4 L 203.093 47.4 A 3.178 3.178 0 0 1 201.954 47.202 A 2.871 2.871 0 0 1 200.903 46.5 Q 200.033 45.6 200.033 44.28 L 200.033 3.66 A 3.191 3.191 0 0 1 200.272 2.411 A 3.024 3.024 0 0 1 200.933 1.44 A 2.943 2.943 0 0 1 203.053 0.54 A 3.507 3.507 0 0 1 203.093 0.54 A 3.191 3.191 0 0 1 204.342 0.779 A 3.024 3.024 0 0 1 205.313 1.44 Q 206.213 2.34 206.213 3.66 L 206.213 41.16 L 227.933 41.16 A 3.191 3.191 0 0 1 229.182 41.399 A 3.024 3.024 0 0 1 230.153 42.06 Q 231.053 42.96 231.053 44.28 A 3.191 3.191 0 0 1 230.813 45.53 A 3.024 3.024 0 0 1 230.153 46.5 Q 229.253 47.4 227.933 47.4 Z" />
      <path d="M 269.333 31.02 L 269.333 44.4 A 3.284 3.284 0 0 1 269.148 45.521 A 2.878 2.878 0 0 1 268.463 46.59 A 2.936 2.936 0 0 1 266.436 47.457 A 3.882 3.882 0 0 1 266.273 47.46 A 3.284 3.284 0 0 1 265.151 47.275 A 2.878 2.878 0 0 1 264.083 46.59 A 2.936 2.936 0 0 1 263.216 44.563 A 3.882 3.882 0 0 1 263.213 44.4 L 263.213 35.22 L 264.353 28.86 L 269.333 31.02 L 266.993 31.02 A 19.168 19.168 0 0 1 266.357 36.039 A 16.351 16.351 0 0 1 264.983 39.51 Q 262.973 43.26 259.493 45.45 A 14.33 14.33 0 0 1 252.177 47.632 A 17.192 17.192 0 0 1 251.633 47.64 A 14.993 14.993 0 0 1 246.272 46.697 A 14.009 14.009 0 0 1 243.773 45.45 Q 240.293 43.26 238.283 39.51 Q 236.273 35.76 236.273 31.02 A 17.599 17.599 0 0 1 237.107 25.535 A 15.808 15.808 0 0 1 238.463 22.5 Q 240.653 18.72 244.403 16.53 A 16.182 16.182 0 0 1 251.927 14.361 A 19.443 19.443 0 0 1 252.833 14.34 A 17.131 17.131 0 0 1 258.244 15.174 A 15.414 15.414 0 0 1 261.233 16.53 Q 264.953 18.72 267.143 22.5 A 16.379 16.379 0 0 1 269.298 29.85 A 19.778 19.778 0 0 1 269.333 31.02 Z M 252.833 42.24 A 10.875 10.875 0 0 0 256.234 41.722 A 9.707 9.707 0 0 0 258.293 40.77 Q 260.693 39.3 262.073 36.75 Q 263.453 34.2 263.453 31.02 A 13.012 13.012 0 0 0 263.022 27.616 A 11.042 11.042 0 0 0 262.073 25.23 Q 260.693 22.68 258.293 21.21 A 10.048 10.048 0 0 0 253.587 19.763 A 12.251 12.251 0 0 0 252.833 19.74 A 10.516 10.516 0 0 0 248.734 20.533 A 10.091 10.091 0 0 0 247.403 21.21 Q 244.973 22.68 243.563 25.23 A 11.326 11.326 0 0 0 242.22 29.636 A 13.93 13.93 0 0 0 242.153 31.02 Q 242.153 34.2 243.563 36.75 Q 244.973 39.3 247.403 40.77 A 10.248 10.248 0 0 0 252.646 42.239 A 12.137 12.137 0 0 0 252.833 42.24 Z" />
      <path d="M 278.453 30.96 L 278.453 3.6 A 3.556 3.556 0 0 1 278.585 2.604 A 2.733 2.733 0 0 1 279.323 1.38 A 2.963 2.963 0 0 1 281.229 0.55 A 3.929 3.929 0 0 1 281.513 0.54 A 3.678 3.678 0 0 1 282.504 0.667 A 2.754 2.754 0 0 1 283.733 1.38 A 2.821 2.821 0 0 1 284.526 2.982 A 3.975 3.975 0 0 1 284.573 3.6 L 284.573 19.8 Q 286.673 17.28 289.643 15.81 A 14.348 14.348 0 0 1 295.658 14.347 A 16.768 16.768 0 0 1 296.153 14.34 A 14.993 14.993 0 0 1 301.514 15.283 A 14.009 14.009 0 0 1 304.013 16.53 Q 307.493 18.72 309.503 22.47 Q 311.513 26.22 311.513 30.96 A 17.599 17.599 0 0 1 310.678 36.445 A 15.808 15.808 0 0 1 309.323 39.48 Q 307.133 43.26 303.413 45.45 A 15.94 15.94 0 0 1 296.445 47.584 A 19.523 19.523 0 0 1 294.953 47.64 A 17.131 17.131 0 0 1 289.541 46.806 A 15.414 15.414 0 0 1 286.553 45.45 Q 282.833 43.26 280.673 39.48 A 16.96 16.96 0 0 1 278.511 32.274 A 20.443 20.443 0 0 1 278.453 30.96 Z M 294.953 42.24 A 10.875 10.875 0 0 0 298.354 41.722 A 9.707 9.707 0 0 0 300.413 40.77 Q 302.813 39.3 304.223 36.72 A 11.607 11.607 0 0 0 305.611 31.746 A 13.861 13.861 0 0 0 305.633 30.96 A 12.733 12.733 0 0 0 305.235 27.721 A 10.691 10.691 0 0 0 304.223 25.2 Q 302.813 22.68 300.413 21.21 A 10.048 10.048 0 0 0 295.707 19.763 A 12.251 12.251 0 0 0 294.953 19.74 A 10.516 10.516 0 0 0 290.854 20.533 A 10.091 10.091 0 0 0 289.523 21.21 Q 287.093 22.68 285.713 25.2 A 11.244 11.244 0 0 0 284.419 29.385 A 14.053 14.053 0 0 0 284.333 30.96 A 12.661 12.661 0 0 0 284.872 34.701 A 11.334 11.334 0 0 0 285.713 36.72 Q 287.093 39.3 289.523 40.77 A 10.248 10.248 0 0 0 294.766 42.239 A 12.137 12.137 0 0 0 294.953 42.24 Z" />
    </svg>
  );
}
