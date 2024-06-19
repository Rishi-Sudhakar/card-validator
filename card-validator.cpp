#include <iostream>
#include <string>
#include <cctype>

// Function to check if the input string is a valid number
bool isValidNumber(const std::string &number) {
    for (char c : number) {
        if (!isdigit(c)) {
            return false;
        }
    }
    return true;
}

// Function to perform the Luhn algorithm check
bool isValidCreditCard(const std::string &number) {
    int sum = 0;
    bool alternate = false;

    // Iterate over the string in reverse
    for (int i = number.length() - 1; i >= 0; --i) {
        int n = number[i] - '0';

        if (alternate) {
            n *= 2;
            if (n > 9) {
                n -= 9;
            }
        }

        sum += n;
        alternate = !alternate;
    }

    return (sum % 10 == 0);
}

int main(int argc, char* argv[]) {
    if (argc > 1 && std::string(argv[1]) == "--single") {
        // Single-shot mode for Electron app
        std::string creditCardNumber;
        std::getline(std::cin, creditCardNumber);

        if (!isValidNumber(creditCardNumber)) {
            std::cout << "Invalid input. Please enter a numeric credit card number.\n";
            return 1;
        }

        if (isValidCreditCard(creditCardNumber)) {
            std::cout << "The credit card number is valid.\n";
        } else {
            std::cout << "The credit card number is invalid.\n";
        }
        return 0;
    }

    // Continuous loop mode for command line
    std::string creditCardNumber;
    std::cout << "Credit Card Validator using Luhn's Algorithm\n";
    std::cout << "-------------------------------------------\n";

    while (true) {
        std::cout << "Enter a credit card number to validate (or 'exit' to quit): ";
        std::getline(std::cin, creditCardNumber);

        if (creditCardNumber == "exit") {
            break;
        }

        if (!isValidNumber(creditCardNumber)) {
            std::cout << "Invalid input. Please enter a numeric credit card number.\n";
            continue;
        }

        if (isValidCreditCard(creditCardNumber)) {
            std::cout << "The credit card number is valid.\n";
        } else {
            std::cout << "The credit card number is invalid.\n";
        }
    }

    return 0;
}
