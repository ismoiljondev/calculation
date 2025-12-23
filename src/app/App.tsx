import FuseLayout from "@fuse/core/FuseLayout";
import { SnackbarProvider } from "notistack";
import themeLayouts from "src/components/theme-layouts/themeLayouts";
import { Provider } from "react-redux";
import FuseSettingsProvider from "@fuse/core/FuseSettings/FuseSettingsProvider";
import { I18nProvider } from "@i18n/I18nProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { enUS } from "date-fns/locale/en-US";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import ErrorBoundary from "@fuse/utils/ErrorBoundary";
import Authentication from "@auth/Authentication";
import MainThemeProvider from "../contexts/MainThemeProvider";
import store from "@/store/store";
import routes from "@/configs/routesConfig";
import AppContext from "@/contexts/AppContext";
import "../styles/index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import i18next from "i18next";

import en from "./i18n/en";
import ru from "./i18n/ru";
import uz from "./i18n/uz";

i18next.addResourceBundle("en", "general", en);
i18next.addResourceBundle("ru", "general", ru);
i18next.addResourceBundle("uz", "general", uz);

export const queryClient = new QueryClient();
/**
 * The main App component.
 */
function App() {
  const AppContextValue = {
    routes,
  };

  return (
    <ErrorBoundary>
      <AppContext value={AppContextValue}>
        <QueryClientProvider client={queryClient}>
          {/* Date Picker Localization Provider */}
          <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={enUS}
          >
            {/* Redux Store Provider */}
            <Provider store={store}>
              <Authentication>
                <FuseSettingsProvider>
                  <I18nProvider>
                    {/* Theme Provider */}
                    <MainThemeProvider>
                      {/* Notistack Notification Provider */}
                      <SnackbarProvider
                        maxSnack={5}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        classes={{
                          containerRoot:
                            "bottom-0 right-0 mb-13 md:mb-17 mr-2 lg:mr-20 z-99",
                        }}
                      >
                        <FuseLayout layouts={themeLayouts} />
                      </SnackbarProvider>
                    </MainThemeProvider>
                  </I18nProvider>
                </FuseSettingsProvider>
              </Authentication>
            </Provider>
          </LocalizationProvider>
          <ReactQueryDevtools
            buttonPosition="bottom-right"
            initialIsOpen={false}
          />
        </QueryClientProvider>
      </AppContext>
    </ErrorBoundary>
  );
}

export default App;
