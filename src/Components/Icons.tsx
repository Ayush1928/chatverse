import { LucideProps, UserPlus } from "lucide-react";

export const Icons = {
  Logo: (props: LucideProps) => (
    <svg {...props} version="1.0" xmlns="http://www.w3.org/2000/svg"
      width="900.000000pt" height="512.000000pt" viewBox="0 0 900.000000 512.000000"
      preserveAspectRatio="xMidYMid meet">

      <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
        fill="#4338ca" stroke="none">
        <path d="M3655 4554 c-16 -2 -66 -9 -110 -15 -499 -65 -942 -370 -1134 -780
          -195 -416 -120 -899 193 -1246 l47 -52 -175 -291 c-137 -230 -169 -291 -153
          -286 12 2 242 46 510 96 l488 91 87 -20 c103 -24 234 -41 314 -41 l58 0 0 53
          c1 48 18 165 35 229 l7 26 -89 6 c-106 8 -254 32 -338 56 l-60 16 -195 -37
          c-107 -20 -196 -35 -198 -34 -2 1 21 43 51 92 l54 89 -114 119 c-240 253 -321
          434 -310 690 6 130 23 200 78 314 137 290 425 499 800 583 88 20 132 23 289
          23 157 0 201 -3 289 -23 475 -107 812 -421 872 -812 10 -65 15 -79 28 -76 33
          10 139 25 217 32 l80 6 -8 67 c-22 173 -108 381 -219 532 -223 302 -561 500
          -979 574 -84 15 -357 28 -415 19z"/>
        <path d="M5165 3190 c-504 -57 -929 -339 -1120 -743 -196 -415 -106 -885 235
          -1227 352 -352 899 -494 1435 -374 l70 16 460 -87 c253 -47 468 -88 478 -91
          11 -3 -44 96 -147 268 l-164 273 34 40 c313 364 378 812 175 1213 -182 359
          -557 618 -1011 698 -106 18 -339 26 -445 14z m-419 -1046 c130 -80 153 -260
          47 -369 -96 -99 -246 -101 -342 -4 -117 116 -86 309 61 384 74 37 164 33 234
          -11z m679 22 c60 -25 104 -66 131 -122 54 -110 15 -244 -90 -309 -44 -27 -58
          -30 -126 -30 -68 0 -82 3 -126 30 -159 99 -150 336 17 419 61 30 139 35 194
          12z m742 -11 c147 -74 179 -268 62 -384 -150 -150 -408 -45 -409 167 -1 181
          185 297 347 217z"/>
      </g>
    </svg>
  ),
  UserPlus
}

export type Icon = keyof typeof Icons;