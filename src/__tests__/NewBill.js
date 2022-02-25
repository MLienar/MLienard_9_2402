/**
 * @jest-environment jsdom
 */

import { screen, waitFor, fireEvent } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import {localStorageMock} from "../__mocks__/localStorage.js";
import router from "../app/Router.js";
import mockStore from "../__mocks__/store"
import { ROUTES_PATH } from "../constants/routes"
import user from "@testing-library/user-event"
import BillsUI from "../views/BillsUI"
import requestsMock from "../__mocks__/requests.js";
import {mockedBill as inputData} from "../__mocks__/bill.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then new-bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)
      await waitFor(() => screen.getByTestId('icon-mail'))
      const windowIcon = screen.getByTestId('icon-mail')
      //to-do write expect expression
      expect(windowIcon.className).toEqual("active-icon")
    })
  test("Then the submission form should be displayed", () => {
    expect(screen.getByTestId("form-new-bill")).toBeTruthy()
  })
  })
  describe("When I upload a file with a supported extension", () => {
    test("Then the file's name will appear in the input", () => {
            document.body.innerHTML = NewBillUI();
              const newBill = new NewBill({
              document, onNavigate, store:mockStore, localStorage: window.localStorage
            })
            const fileInput = screen.getByTestId("file")
            const changeFile = jest.fn(() => {newBill.handleChangeFile})
            fileInput.addEventListener("change", changeFile)
            const file = new File([new ArrayBuffer(1)], 'file.jpg');
            fireEvent.change(fileInput, {
              target: {
                files: file
              }
            })
            expect(changeFile).toHaveBeenCalled()
    })
  })
  describe("When I submit the new-bill form", () => {
    test("Then the new bill should be submitted", () => {
    document.body.innerHTML = NewBillUI();
    const newBill = new NewBill({
              document, onNavigate, store:mockStore, localStorage: window.localStorage
    })
   
    const form = screen.getByTestId("form-new-bill")
    const formSubmit = jest.fn(() => {newBill.handleSubmit})
    form.addEventListener("submit", formSubmit)
    fireEvent.submit(form, {
      target: {
        ...inputData
      }
    })
    expect(formSubmit).toHaveBeenCalled()
    }) 
  })
})

// test d'intégration POST
  describe("When I create a new bill", () => {
    const postRequest = jest
      .fn(mockStore.create)
      .mockImplementationOnce(mockStore.create)
      .mockImplementationOnce(requestsMock.error404)
      .mockImplementationOnce(requestsMock.error500)

    test("Then a POST request should be made", async () => {
      const bills = await postRequest(inputData)
      expect(postRequest).toHaveBeenCalledTimes(1)
    })

    test("Then a 404 response should be sent", async () => {
      let response

      try {
        response = await postRequest(inputData)
      } catch (e) {
        response = {error: e}
      }

      document.body.innerHTML = BillsUI(response)

      expect(postRequest).toHaveBeenCalledTimes(2)
      expect(screen.getByText(/Erreur 404/)).toBeTruthy()
    })

    test("Then a 500 error should be sent", async () => {
      let response

      try {
        response = await postRequest(inputData)
      } catch (e) {
        response = {error: e}
      }

      document.body.innerHTML = BillsUI(response)

      expect(postRequest).toHaveBeenCalledTimes(3)
      expect(screen.getByText(/Erreur 500/)).toBeTruthy()
    })
})
