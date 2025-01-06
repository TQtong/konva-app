/// <reference types="vite/client" />
import BaseClass from '@/class/BaseClass'

declare global {
  interface Window {
    baseClass: BaseClass
  }
}
